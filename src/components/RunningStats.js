import React, { useEffect, useState, useMemo } from 'react';
import { Chart as ChartJS, LineElement, BarElement, ArcElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './RunningStats.css';
import Navigation from './Navigation';

ChartJS.register(LineElement, BarElement, ArcElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip, Legend);

// ── Config ────────────────────────────────────────────────────────────────────

const CLIENT_ID     = process.env.REACT_APP_STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_STRAVA_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REACT_APP_STRAVA_REFRESH_TOKEN;
const ATHLETE_ID    = process.env.REACT_APP_STRAVA_ATHLETE_ID;
const STRAVA_BASE   = 'https://www.strava.com/api/v3';
const CACHE_KEY     = 'rs_strava_v5';
const CACHE_TTL_MS  = 6 * 60 * 60 * 1000;

const EFFORT_DISTANCES = [
    // minMeters: activity must be AT LEAST this distance (no scaling up short runs)
    // maxMeters: activity must be no longer than this
    // For marathon: must be a genuine race (>=40km), not a training long run
    { id: 'marathon', label: 'Marathon',      meters: 42195, minMeters: 40000, maxMeters: 46000 },
    { id: 'half',     label: 'Half Marathon', meters: 21098, minMeters: 20000, maxMeters: 23000 },
    { id: '15k',      label: '15K',           meters: 15000, minMeters: 14000, maxMeters: 16500 },
    { id: '10k',      label: '10K',           meters: 10000, minMeters:  9500, maxMeters: 11000 },
    { id: '5k',       label: '5K',            meters: 5000,  minMeters:  4700, maxMeters:  5500 },
];

const HR_ZONE_COLORS = ['#3B8BD4', '#1D9E75', '#BA7517', '#E24B4A', '#993C1D'];
const HR_ZONE_LABELS = ['Z1 Recovery', 'Z2 Aerobic', 'Z3 Tempo', 'Z4 Threshold', 'Z5 Max'];
const RUN_TYPE_COLOR = { easy: '#1D9E75', long: '#185FA5', tempo: '#BA7517', race: '#E24B4A', other: '#888' };

// ── Cache ─────────────────────────────────────────────────────────────────────

function cacheGet() {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const { ts, data } = JSON.parse(raw);
        if (Date.now() - ts > CACHE_TTL_MS) return null;
        return data;
    } catch { return null; }
}
function cacheSet(data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch {}
}

// ── Auth — 4 requests total per cold load ─────────────────────────────────────

let _token = null, _expiry = 0;
async function getToken() {
    if (_token && Math.floor(Date.now() / 1000) < _expiry - 60) return _token;
    const res = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, refresh_token: REFRESH_TOKEN, grant_type: 'refresh_token' }),
    });
    if (!res.ok) throw new Error(`Token refresh failed (${res.status})`);
    const d = await res.json();
    _token = d.access_token; _expiry = d.expires_at;
    return _token;
}

const api = async (path, params = {}) => {
    const token = await getToken();
    const url = new URL(`${STRAVA_BASE}${path}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`Strava ${res.status} on ${path}`);
    return res.json();
};

// ── Formatters ────────────────────────────────────────────────────────────────

function fmt(s) {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.round(s % 60).toString().padStart(2, '0');
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${sec}` : `${m}:${sec}`;
}
function paceStr(secs, meters) {
    const spk = secs / (meters / 1000);
    return `${Math.floor(spk / 60)}:${Math.round(spk % 60).toString().padStart(2, '0')}`;
}
function fmtShort(iso) {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
function fmtFull(iso) {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
function stravaLink(id) { return `https://www.strava.com/activities/${id}`; }

// ── Data helpers ──────────────────────────────────────────────────────────────

function classifyRun(a) {
    if (!a.moving_time || !a.distance) return 'other';
    const km = a.distance / 1000, p = a.moving_time / km;
    if (km >= 18) return 'long';
    if (p < 290)  return 'race';
    if (p < 320)  return 'tempo';
    return 'easy';
}

function hrZoneIdx(hr) {
    const p = hr / 190;
    return p < 0.60 ? 0 : p < 0.70 ? 1 : p < 0.80 ? 2 : p < 0.90 ? 3 : 4;
}

function buildBestEfforts(activities) {
    const result = {};
    EFFORT_DISTANCES.forEach(dist => {
        const candidates = activities.filter(a =>
            a.distance >= dist.minMeters &&
            a.distance <= dist.maxMeters &&
            a.moving_time > 0
        );
        // Sort by actual pace (moving_time / distance) — no extrapolation
        // This means a 10.2km run at 4:30/km beats a 9.8km run at 4:35/km fairly
        result[dist.id] = candidates
            .sort((a, b) => (a.moving_time / a.distance) - (b.moving_time / b.distance))
            .slice(0, 3)
            .map((a, i) => ({
                // Show actual time for the actual distance run, not scaled
                elapsed_time: a.moving_time,
                actual_distance: a.distance,
                start_date: a.start_date,
                name: a.name,
                id: a.id,
                rank: i + 1,
            }));
    });
    return result;
}

function buildWeeks(activities, n = 16) {
    const now = Date.now();
    const weeks = Array.from({ length: n }, (_, i) => {
        const d = new Date(now - (n - 1 - i) * 7 * 86400 * 1000);
        return { weekLabel: d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }), km: 0, runs: 0, totalTime: 0, longRun: 0 };
    });
    activities.forEach(a => {
        const weeksAgo = Math.floor((now - new Date(a.start_date).getTime()) / (7 * 86400 * 1000));
        if (weeksAgo < 0 || weeksAgo >= n) return;
        const w = weeks[n - 1 - weeksAgo];
        w.km += a.distance / 1000; w.runs += 1; w.totalTime += a.moving_time;
        if (a.distance > w.longRun) w.longRun = a.distance;
    });
    weeks.forEach(w => {
        w.km = Math.round(w.km * 10) / 10;
        w.longRun = Math.round(w.longRun / 100) / 10;
        w.avgPace = w.km > 0 ? Math.round(w.totalTime / w.km) : 0;
    });
    return weeks;
}

function buildHRZones(activities) {
    const z = [0, 0, 0, 0, 0];
    activities.forEach(a => { if (a.average_heartrate) z[hrZoneIdx(a.average_heartrate)] += a.moving_time; });
    return z;
}

function inWindow(activities, days) {
    const cutoff = Date.now() - days * 86400 * 1000;
    return activities.filter(a => new Date(a.start_date).getTime() > cutoff);
}

// ── Insights engine ───────────────────────────────────────────────────────────

function deriveInsights(runs, weeks) {
    const insights = [];
    if (!runs.length || weeks.length < 4) return insights;

    const recent4 = weeks.slice(-4), prev4 = weeks.slice(-8, -4);
    // const thisWeek = weeks[weeks.length - 1], lastWeek = weeks[weeks.length - 2];
    const avgRecent = recent4.reduce((s, w) => s + w.km, 0) / 4;
    const avgPrev   = prev4.reduce((s, w) => s + w.km, 0) / 4;

    if (avgRecent > 0 && avgPrev > 0) {
        const delta = Math.round(((avgRecent - avgPrev) / avgPrev) * 100);
        if (delta > 20)
            insights.push({ type: 'warn', icon: '↑', text: `Volume up ${delta}% over the past 4 weeks (avg ${Math.round(avgRecent)} km/wk vs ${Math.round(avgPrev)} km/wk prior). The 10% rule suggests a cutback week at ~${Math.round(avgRecent * 0.75)} km to absorb the load before building again.` });
        else if (delta < -20)
            insights.push({ type: 'info', icon: '↓', text: `Volume down ${Math.abs(delta)}% vs prior 4 weeks (${Math.round(avgRecent)} km/wk vs ${Math.round(avgPrev)} km/wk). If unintentional, add one extra easy run per week — 45–60 min at Z1–Z2 is enough to rebuild momentum.` });
        else
            insights.push({ type: 'ok', icon: '→', text: `Load consistent at ~${Math.round(avgRecent)} km/week — solid base-building pace. Delta vs prior block: ${delta > 0 ? '+' : ''}${delta}%. Ready to add a structured workout (tempo or intervals) if not already doing so.` });
    }

    const maxLong = Math.max(...recent4.map(w => w.longRun));
    const prevLong = Math.max(...prev4.map(w => w.longRun));
    if (maxLong < 15)
        insights.push({ type: 'warn', icon: '!', text: `Longest run in 4 weeks: ${maxLong} km. Marathon aerobic development needs 18–22 km long runs. Target ${Math.min(maxLong + 3, 20)} km this weekend — keep it conversational pace (Z2), no faster.` });
    else if (maxLong >= 20)
        insights.push({ type: 'ok', icon: '✓', text: `Long run progression: ${prevLong > 0 ? prevLong + ' km → ' : ''}${maxLong} km in the last 4 weeks. Aerobic base is building well. Next milestone: ${Math.min(maxLong + 2, 32)} km — add only if you had at least 2 easy days before.` });
    else
        insights.push({ type: 'ok', icon: '✓', text: `Long run at ${maxLong} km — good range for half-marathon prep. For marathon, aim to add 1–2 km to the long run every 2 weeks, targeting 28–32 km peak.` });

    const last30 = runs.slice(0, 30);
    const zones30 = buildHRZones(last30);
    const total30 = zones30.reduce((a, b) => a + b, 0);
    if (total30 > 0) {
        const easyPct = Math.round((zones30[0] + zones30[1]) / total30 * 100);
        const hardPct = Math.round((zones30[3] + zones30[4]) / total30 * 100);
        if (easyPct < 55)
            insights.push({ type: 'warn', icon: '♥', text: `Only ${easyPct}% of time in Z1–Z2 (last 30 runs). Optimal aerobic development requires ~80% easy. Your easy days are probably too fast — slow down by 30–45 sec/km and let HR settle below ${Math.round(190 * 0.75)} bpm.` });
        else if (hardPct > 25)
            insights.push({ type: 'warn', icon: '♥', text: `${hardPct}% of time in Z4–Z5 over last 30 runs — above the recommended 10–20% hard ceiling. Risk of accumulated fatigue. Insert an extra Z2 run before your next hard session and prioritise 8h sleep.` });
        else
            insights.push({ type: 'ok', icon: '♥', text: `${easyPct}% in Z1–Z2 over last 30 runs — well-polarised distribution. Keep easy days easy (under ${Math.round(190 * 0.75)} bpm) so hard sessions can be genuinely hard.` });
    }

    const last7 = inWindow(runs, 7);
    if (last7.length >= 6)
        insights.push({ type: 'warn', icon: 'Z', text: `${last7.length} runs in 7 days with no apparent rest. Adaptations from training happen during recovery — without rest, you're accumulating fatigue without absorbing it. Take a rest or cross-training day in the next 48h.` });

    return insights.slice(0, 4);
}

// ── Components ────────────────────────────────────────────────────────────────

function BestEffortsTable({ efforts }) {
    const [activeId, setActiveId] = useState('marathon');
    const dist = EFFORT_DISTANCES.find(d => d.id === activeId);
    const rows = efforts[activeId] ?? [];

    return (
        <div className="rs-be-wrap">
            <div className="rs-be-tabs">
                {EFFORT_DISTANCES.map(d => (
                    <button key={d.id} className={`rs-be-tab${activeId === d.id ? ' active' : ''}`} onClick={() => setActiveId(d.id)}>
                        {d.label}
                    </button>
                ))}
            </div>
            {rows.length === 0
                ? <p className="rs-empty">No {dist.label} efforts found in last ~200 activities (looking for {(dist.minMeters/1000).toFixed(1)}–{(dist.maxMeters/1000).toFixed(1)} km runs).</p>
                : <div className="rs-be-rows">
                    {rows.map((r, i) => (
                        <a key={i} href={stravaLink(r.id)} target="_blank" rel="noopener noreferrer" className={`rs-be-row${i === 0 ? ' best' : ''}`}>
                            <span className="rs-be-rank">#{i + 1}</span>
                            <div className="rs-be-main">
                                <span className="rs-be-time">{fmt(r.elapsed_time)}</span>
                                <span className="rs-be-pace">{paceStr(r.elapsed_time, r.actual_distance)}/km</span>
                                {i === 0 && <span className="rs-be-pr-tag">PR</span>}
                            </div>
                            <div className="rs-be-right">
                                <span className="rs-be-name">{r.name}</span>
                                <span className="rs-be-date">{fmtFull(r.start_date)} · {(r.actual_distance / 1000).toFixed(2)} km</span>
                            </div>
                            <span className="rs-be-arrow">↗</span>
                        </a>
                    ))}
                </div>
            }
        </div>
    );
}

function WeeklyVolumeChart({ weeks }) {
    const maxKm    = Math.max(...weeks.map(w => w.km), 1);
    const avg4     = Math.round(weeks.slice(-4).reduce((s, w) => s + w.km, 0) / 4 * 10) / 10;
    const avg4prev = Math.round(weeks.slice(-8, -4).reduce((s, w) => s + w.km, 0) / 4 * 10) / 10;
    const [hover, setHover] = useState(null);

    return (
        <div>
            <div className="rs-wv-meta">
                <span>4-wk avg: <strong>{avg4} km</strong></span>
                {avg4prev > 0 && (
                    <span className={`rs-wv-delta ${avg4 >= avg4prev ? 'up' : 'down'}`}>
                        {avg4 >= avg4prev ? '▲' : '▼'} {Math.abs(Math.round((avg4 - avg4prev) * 10) / 10)} km vs prior 4-wk block ({avg4prev} km)
                    </span>
                )}
            </div>
            <div className="rs-weekly-chart">
                {weeks.map((w, i) => {
                    const h = Math.round((w.km / maxKm) * 100);
                    const isThis = i === weeks.length - 1;
                    return (
                        <div key={i} className="rs-week-col" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                            {hover === i && w.km > 0 && (
                                <div className="rs-week-tooltip">
                                    <strong>{w.weekLabel}</strong>
                                    <span>{w.km} km · {w.runs} run{w.runs !== 1 ? 's' : ''}</span>
                                    {w.longRun > 0 && <span>Longest: {w.longRun} km</span>}
                                    {w.avgPace > 0 && <span>Avg pace: {paceStr(w.avgPace * w.km, w.km * 1000)}/km</span>}
                                </div>
                            )}
                            <div className="rs-week-bar-wrap">
                                <div className={`rs-week-bar${isThis ? ' this-week' : ''}${hover === i ? ' hovered' : ''}`} style={{ height: `${h}%` }} />
                            </div>
                            <div className="rs-week-label">{(i % 4 === 0 || isThis) ? w.weekLabel : ''}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function RunTimeline({ activities }) {
    const runs  = useMemo(() => inWindow(activities, 30), [activities]);
    const maxKm = Math.max(...runs.map(a => a.distance / 1000), 1);
    if (!runs.length) return <p className="rs-empty">No runs in the last 30 days.</p>;
    return (
        <div className="rs-timeline">
            {runs.map((a, i) => {
                const km = (a.distance / 1000).toFixed(1);
                const type = classifyRun(a);
                const w = Math.max(Math.round((a.distance / 1000 / maxKm) * 100), 3);
                const p = a.moving_time && a.distance ? paceStr(a.moving_time, a.distance) : null;
                return (
                    <div key={i} className="rs-tl-row">
                        <div className="rs-tl-date">{fmtShort(a.start_date)}</div>
                        <div className="rs-tl-center">
                            <a href={stravaLink(a.id)} target="_blank" rel="noopener noreferrer" className="rs-tl-bar-link" title="Open in Strava">
                                <div className="rs-tl-bar-bg">
                                    <div className="rs-tl-bar" style={{ width: `${w}%`, background: RUN_TYPE_COLOR[type] }} />
                                </div>
                            </a>
                            <div className="rs-tl-name">
                                <a href={stravaLink(a.id)} target="_blank" rel="noopener noreferrer" className="rs-tl-name-link">{a.name}</a>
                            </div>
                        </div>
                        <div className="rs-tl-meta">
                            <span className="rs-tl-km">{km} km</span>
                            {p && <span className="rs-tl-pace">{p}/km</span>}
                            {a.average_heartrate && <span className="rs-tl-hr">{Math.round(a.average_heartrate)} bpm</span>}
                            {a.total_elevation_gain > 10 && <span className="rs-tl-elev">↑{Math.round(a.total_elevation_gain)}m</span>}
                        </div>
                    </div>
                );
            })}
            <div className="rs-tl-legend">
                {Object.entries(RUN_TYPE_COLOR).map(([k, c]) => (
                    <span key={k} className="rs-tl-legend-item">
                        <span className="rs-tl-legend-dot" style={{ background: c }} />{k}
                    </span>
                ))}
            </div>
        </div>
    );
}

function HRDonut({ runs }) {
    const [days, setDays] = useState(30);
    const windows = [{ label: '1 week', days: 7 }, { label: '1 month', days: 30 }, { label: '2 months', days: 60 }, { label: '3 months', days: 90 }];
    const filtered = useMemo(() => inWindow(runs, days), [runs, days]);
    const zones    = useMemo(() => buildHRZones(filtered), [filtered]);
    const total    = zones.reduce((a, b) => a + b, 0);
    const withHR   = filtered.filter(a => a.average_heartrate).length;

    return (
        <div>
            <div className="rs-window-tabs">
                {windows.map(w => (
                    <button key={w.days} className={`rs-window-tab${days === w.days ? ' active' : ''}`} onClick={() => setDays(w.days)}>
                        {w.label}
                    </button>
                ))}
            </div>
            {total === 0
                ? <p className="rs-empty">{filtered.length} runs in window, {withHR} with HR data.</p>
                : <div className="rs-hr-wrap">
                    <div style={{ width: 120, height: 120, flexShrink: 0 }}>
                        <Doughnut
                            data={{ labels: HR_ZONE_LABELS, datasets: [{ data: zones, backgroundColor: HR_ZONE_COLORS, borderWidth: 0, hoverOffset: 4 }] }}
                            options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${Math.round(c.raw / total * 100)}% · ${Math.round(c.raw / 60)} min` } } } }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        {zones.map((z, i) => {
                            const pct = total ? Math.round(z / total * 100) : 0;
                            return (
                                <div key={i} className="rs-zone-row">
                                    <span className="rs-zone-dot" style={{ background: HR_ZONE_COLORS[i] }} />
                                    <span className="rs-zone-label">{HR_ZONE_LABELS[i]}</span>
                                    <div className="rs-zone-bar"><div className="rs-zone-bar-fill" style={{ width: `${pct}%`, background: HR_ZONE_COLORS[i] }} /></div>
                                    <span className="rs-zone-pct">{pct}%</span>
                                    <span className="rs-zone-min">{Math.round(z / 60)}m</span>
                                </div>
                            );
                        })}
                        <p className="rs-zone-note">{withHR} of {filtered.length} runs · {Math.round(total / 60)} min total</p>
                    </div>
                </div>
            }
        </div>
    );
}

function LastWeekPanel({ runs }) {
    const now      = new Date();
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
    const weekStart  = new Date(todayStart.getTime() - 7 * 86400 * 1000);
    const weekRuns   = runs.filter(a => {
        const t = new Date(a.start_date).getTime();
        return t >= weekStart.getTime() && t < todayStart.getTime();
    });
    const totalKm  = Math.round(weekRuns.reduce((s, a) => s + a.distance / 1000, 0) * 10) / 10;
    const totalMin = Math.round(weekRuns.reduce((s, a) => s + a.moving_time, 0) / 60);

    return (
        <div>
            <div className="rs-lw-summary">
                <span><strong>{totalKm} km</strong> · {weekRuns.length} runs · {totalMin} min</span>
                <span className="rs-lw-range">{fmtShort(weekStart.toISOString())} – {fmtShort(new Date(todayStart.getTime() - 1).toISOString())}</span>
            </div>
            {weekRuns.length === 0
                ? <p className="rs-empty">No runs in the past 7 days (yesterday back).</p>
                : weekRuns.map((a, i) => {
                    const type = classifyRun(a);
                    const p    = a.moving_time && a.distance ? paceStr(a.moving_time, a.distance) : null;
                    return (
                        <a key={i} href={stravaLink(a.id)} target="_blank" rel="noopener noreferrer" className="rs-lw-row">
                            <span className="rs-lw-dot" style={{ background: RUN_TYPE_COLOR[type] }} />
                            <div className="rs-lw-info">
                                <span className="rs-lw-name">{a.name}</span>
                                <span className="rs-lw-meta">{fmtFull(a.start_date)}{p && ` · ${p}/km`}{a.average_heartrate && ` · ${Math.round(a.average_heartrate)} bpm`}</span>
                            </div>
                            <span className="rs-lw-km">{(a.distance / 1000).toFixed(1)} km</span>
                            <span className="rs-lw-arrow">↗</span>
                        </a>
                    );
                })
            }
        </div>
    );
}

function InsightBanner({ insights }) {
    if (!insights.length) return null;
    return (
        <div className="rs-insights">
            {insights.map((ins, i) => (
                <div key={i} className={`rs-insight rs-insight--${ins.type}`}>
                    <span className="rs-insight-icon">{ins.icon}</span>
                    <span className="rs-insight-text">{ins.text}</span>
                </div>
            ))}
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function RunningStats() {
    const [athlete,   setAthlete]   = useState(null);
    const [efforts,   setEfforts]   = useState({});
    const [runs,      setRuns]      = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [progress,  setProgress]  = useState('');
    const [error,     setError]     = useState(null);
    const [fromCache, setFromCache] = useState(false);
    const [fetchedAt, setFetchedAt] = useState(null);

    useEffect(() => {
        const load = async () => {
            const cached = cacheGet();
            if (cached) { hydrate(cached); setFromCache(true); setLoading(false); return; }
            if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
                setError('Add REACT_APP_STRAVA_CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN to .env');
                setLoading(false); return;
            }
            try {
                setProgress('profile…');
                const athleteData = await api('/athlete');
                setProgress('activities…');
                const [page1, page2] = await Promise.all([
                    api('/athlete/activities', { per_page: 100, page: 1 }),
                    api('/athlete/activities', { per_page: 100, page: 2 }),
                ]);
                const runData = [...page1, ...page2].filter(a => a.type === 'Run' || a.sport_type === 'Run');
                const payload = { athleteData, runData, fetchedAt: new Date().toISOString() };
                cacheSet(payload);
                hydrate(payload);
            } catch (e) { console.error(e); setError(e.message); }
            finally { setLoading(false); }
        };
        load();
    }, []); // eslint-disable-line

    function hydrate({ athleteData, runData, fetchedAt: fa }) {
        setAthlete(athleteData);
        setEfforts(buildBestEfforts(runData));
        setRuns(runData);
        if (fa) setFetchedAt(fa);
    }

    const weeks    = useMemo(() => buildWeeks(runs, 16), [runs]);
    const insights = useMemo(() => deriveInsights(runs, weeks), [runs, weeks]);
    const stravaUrl  = ATHLETE_ID ? `https://www.strava.com/athletes/${ATHLETE_ID}` : 'https://www.strava.com';
    const thisWeekKm = weeks[weeks.length - 1]?.km ?? 0;
    const lastWeekKm = weeks[weeks.length - 2]?.km ?? 0;
    const avg4wk     = Math.round(weeks.slice(-4).reduce((s, w) => s + w.km, 0) / 4 * 10) / 10;

    return (
        <>
            <Navigation />
            <div className="rs-page">

                <div className="rs-header">
                    <div className="rs-header-top">
                        <div>
                            <h1 className="rs-title">TRAINING<br /><span>DASHBOARD</span></h1>
                            <p className="rs-subtitle">
                                {athlete
                                    ? <a href={stravaUrl} target="_blank" rel="noopener noreferrer" className="rs-subtitle-link">
                                        {athlete.firstname} {athlete.lastname} · Strava ↗
                                    </a>
                                    : 'Running performance tracker'}
                            </p>
                        </div>
                        <div className="rs-week-summary">
                            <div className="rs-wsum-block">
                                <div className="rs-wsum-val">{thisWeekKm} <span>km</span></div>
                                <div className="rs-wsum-label">this week (Mon–today)</div>
                                {lastWeekKm > 0 && (
                                    <div className={`rs-wsum-delta ${thisWeekKm >= lastWeekKm ? 'up' : 'down'}`}>
                                        {thisWeekKm >= lastWeekKm ? '▲' : '▼'} {Math.abs(Math.round((thisWeekKm - lastWeekKm) * 10) / 10)} km vs last week
                                    </div>
                                )}
                            </div>
                            <div className="rs-wsum-divider" />
                            <div className="rs-wsum-block">
                                <div className="rs-wsum-val">{lastWeekKm} <span>km</span></div>
                                <div className="rs-wsum-label">last week</div>
                            </div>
                            <div className="rs-wsum-divider" />
                            <div className="rs-wsum-block">
                                <div className="rs-wsum-val">{avg4wk} <span>km</span></div>
                                <div className="rs-wsum-label">4-week avg</div>
                            </div>
                        </div>
                    </div>
                </div>

                {loading && <div className="rs-loading-bar"><span className="rs-loading-dot" /><span>Fetching {progress}</span></div>}
                {error   && <div className="rs-error"><strong>Error:</strong> {error}</div>}

                {!loading && !error && runs.length > 0 && (
                    <>
                        <InsightBanner insights={insights} />

                        <div className="rs-card rs-card--mb">
                            <h2 className="rs-card-title">Best efforts — top 3 per distance · from last ~200 activities · actual time &amp; pace shown · click to open in Strava</h2>
                            <BestEffortsTable efforts={efforts} />
                        </div>

                        <div className="rs-card rs-card--mb">
                            <h2 className="rs-card-title">Weekly volume · 16 weeks &nbsp;·&nbsp; hover for details</h2>
                            <WeeklyVolumeChart weeks={weeks} />
                        </div>

                        <div className="rs-main-grid">
                            <div className="rs-card">
                                <h2 className="rs-card-title">Run timeline · last 30 days &nbsp;·&nbsp; click any run → Strava</h2>
                                <RunTimeline activities={runs} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div className="rs-card">
                                    <h2 className="rs-card-title">Intensity by HR zone</h2>
                                    <HRDonut runs={runs} />
                                </div>
                                <div className="rs-card">
                                    <h2 className="rs-card-title">Last 7 days &nbsp;·&nbsp; click any run → Strava</h2>
                                    <LastWeekPanel runs={runs} />
                                </div>
                            </div>
                        </div>

                        <div className="rs-footer">
                            <a href={stravaUrl} target="_blank" rel="noopener noreferrer" className="rs-cta primary">Strava profile ↗</a>
                            <a href={`${stravaUrl}/training/log`} target="_blank" rel="noopener noreferrer" className="rs-cta">Training log ↗</a>
                            {fromCache && <button className="rs-cta" onClick={() => { localStorage.removeItem(CACHE_KEY); window.location.reload(); }}>↺ Refresh from Strava</button>}
                            {fetchedAt && <span className="rs-fetched">Data as of {fmtFull(fetchedAt)}</span>}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
