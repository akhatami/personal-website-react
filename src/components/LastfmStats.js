import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LastfmStats.css';
import Navigation from "./Navigation";

const API_KEY = process.env.REACT_APP_LASTFM_API_KEY;
const USER = 'ali_khat';

const PERIOD_LABELS = {
    '1month':  '1 Month',
    '3month':  '3 Months',
    '6month':  '6 Months',
    '12month': '12 Months',
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const lfm = async (params) => {
    const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
        params: { api_key: API_KEY, format: 'json', user: USER, ...params },
    });
    if (response.data.error) throw new Error(`Last.fm ${response.data.error}: ${response.data.message}`);
    return response.data;
};

// Sequential fetcher — waits between each call to avoid rate limiting
const fetchAll = async (calls) => {
    const results = [];
    for (const call of calls) {
        try {
            results.push(await call());
        } catch (e) {
            console.warn('Last.fm call failed, using empty fallback:', e.message);
            results.push(null);
        }
        await sleep(250);
    }
    return results;
};

function getImg(item, size = 'extralarge') {
    const img = item?.image?.find(i => i.size === size) || item?.image?.find(i => i.size === 'large');
    const url = img?.['#text'];
    return url && url.trim() !== '' ? url : null;
}

function deriveInsight(allStats) {
    if (!allStats['3month']?.length || !allStats['12month']?.length) return null;
    const top3m  = allStats['3month'][0]?.name;
    const top12m = allStats['12month'][0]?.name;
    if (top3m && top12m && top3m !== top12m)
        return `You've shifted from ${top12m} to ${top3m} — your taste is evolving.`;
    if (top3m && top3m === top12m)
        return `${top3m} has been your anchor artist all year. Consistency or obsession?`;
    return null;
}

function findRisingArtists(allStats) {
    if (!allStats['3month']?.length || !allStats['12month']?.length) return [];
    const recent   = new Set(allStats['3month'].slice(0, 5).map(a => a.name));
    const longTerm = new Set(allStats['12month'].map(a => a.name));
    return [...recent].filter(name => !longTerm.has(name));
}

function findDroppedArtists(allStats) {
    if (!allStats['3month']?.length || !allStats['12month']?.length) return [];
    const recent   = new Set(allStats['3month'].map(a => a.name));
    const longTerm = allStats['12month'].slice(0, 5).map(a => a.name);
    return longTerm.filter(name => !recent.has(name));
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatChip({ label, value }) {
    return (
        <div className="stat-chip">
            <span className="stat-chip-value">{value}</span>
            <span className="stat-chip-label">{label}</span>
        </div>
    );
}

function ArtistBar({ artist, index, maxPlays }) {
    const pct = Math.round((parseInt(artist.playcount) / maxPlays) * 100);
    return (
        <div className="artist-row">
            <span className="artist-rank">#{index + 1}</span>
            <div className="artist-info">
                <span className="artist-name">{artist.name}</span>
                <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${pct}%` }} />
                </div>
            </div>
            <span className="artist-plays">{parseInt(artist.playcount).toLocaleString()}</span>
        </div>
    );
}

function AlbumGrid({ albums }) {
    return (
        <div className="album-grid">
            {albums.map((album, i) => {
                const cover = getImg(album);
                return (
                    <div key={album.name + album.artist?.name} className="album-grid-item">
                        {cover
                            ? <img src={cover} alt={album.name} className="album-grid-img" />
                            : <div className="album-grid-placeholder" />
                        }
                        <div className="album-grid-overlay">
                            <span className="album-grid-rank">#{i + 1}</span>
                            <span className="album-grid-plays">{parseInt(album.playcount).toLocaleString()} plays</span>
                        </div>
                        <div className="album-grid-meta">
                            <span className="album-grid-name">{album.name}</span>
                            <span className="album-grid-artist">{album.artist?.name}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function TrackList({ tracks }) {
    return (
        <div>
            {tracks.map((track, i) => {
                const cover = getImg(track, 'medium');
                return (
                    <div key={track.name + track.artist?.name} className="track-row">
                        <span className="track-rank">{i + 1}</span>
                        {cover
                            ? <img src={cover} alt="" className="track-thumb" />
                            : <div className="track-thumb track-thumb-empty" />
                        }
                        <div className="track-info">
                            <span className="track-name">{track.name}</span>
                            <span className="track-artist">{track.artist?.name}</span>
                        </div>
                        <span className="track-plays">{parseInt(track.playcount).toLocaleString()}</span>
                    </div>
                );
            })}
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function LastfmStats() {
    const [allStats,  setAllStats]  = useState({});
    const [allAlbums, setAllAlbums] = useState({});
    const [allTracks, setAllTracks] = useState({});
    const [recent,    setRecent]    = useState([]);
    const [userInfo,  setUserInfo]  = useState(null);
    const [activePeriod, setActivePeriod] = useState('3month');
    const [activeTab,    setActiveTab]    = useState('artists');
    const [loading,  setLoading]  = useState(true);
    const [progress, setProgress] = useState('');
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        const load = async () => {
            const periods = ['1month', '3month', '6month', '12month'];
            const stats = {}, albums = {}, tracks = {};

            try {
                setProgress('user info…');
                const userData = await lfm({ method: 'user.getInfo' });
                setUserInfo(userData.user);
                await sleep(250);

                setProgress('recent tracks…');
                const recentData = await lfm({ method: 'user.getRecentTracks', limit: 8 });
                setRecent(recentData.recenttracks.track || []);
                await sleep(250);

                for (const period of periods) {
                    setProgress(`artists · ${PERIOD_LABELS[period]}…`);
                    const artistData = await lfm({ method: 'user.getTopArtists', period, limit: 10 });
                    stats[period] = artistData.topartists.artist || [];
                    // Stream artists into state immediately so UI updates progressively
                    setAllStats(prev => ({ ...prev, [period]: stats[period] }));
                    await sleep(300);

                    setProgress(`albums · ${PERIOD_LABELS[period]}…`);
                    const albumData = await lfm({ method: 'user.getTopAlbums', period, limit: 6 });
                    albums[period] = albumData.topalbums.album || [];
                    setAllAlbums(prev => ({ ...prev, [period]: albums[period] }));
                    await sleep(300);

                    setProgress(`tracks · ${PERIOD_LABELS[period]}…`);
                    const trackData = await lfm({ method: 'user.getTopTracks', period, limit: 10 });
                    tracks[period] = trackData.toptracks.track || [];
                    setAllTracks(prev => ({ ...prev, [period]: tracks[period] }));
                    await sleep(300);
                }

                setLastUpdated(new Date().toLocaleString('en-GB', { timeZone: 'UTC', timeZoneName: 'short' }));
            } catch (e) {
                console.error('Last.fm fetch error:', e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const artists  = allStats[activePeriod]  || [];
    const albums   = allAlbums[activePeriod] || [];
    const tracks   = allTracks[activePeriod] || [];
    const maxPlays = artists[0] ? parseInt(artists[0].playcount) : 1;
    const insight  = deriveInsight(allStats);
    const rising   = findRisingArtists(allStats);
    const dropped  = findDroppedArtists(allStats);
    const periodTotal = artists.reduce((s, a) => s + parseInt(a.playcount), 0);

    return (
        <>
            <Navigation />
            <div className="lastfm-stats">

                {/* Header */}
                <div className="lastfm-header">
                    <div>
                        <h1 className="lastfm-title">LISTENING REPORT</h1>
                        <p className="lastfm-subtitle">
                            {userInfo
                                ? `${parseInt(userInfo.playcount).toLocaleString()} total scrobbles · since ${new Date(parseInt(userInfo.registered?.unixtime) * 1000).getFullYear()}`
                                : 'ali_khat on Last.fm'}
                        </p>
                    </div>
                    {userInfo && (
                        <div className="header-chips">
                            <StatChip label="scrobbles" value={parseInt(userInfo.playcount).toLocaleString()} />
                            <StatChip label="artists"   value={parseInt(userInfo.artist_count || 0).toLocaleString()} />
                        </div>
                    )}
                </div>

                {/* Insight banner */}
                {insight && (
                    <div className="insight-banner">
                        <span className="insight-icon">↗</span>
                        <span>{insight}</span>
                    </div>
                )}

                {/* Loading state — shows progress label and already-loaded data */}
                {loading && (
                    <div className="loading-bar">
                        <span className="loading-dot" />
                        <span className="loading-text">Fetching {progress}</span>
                    </div>
                )}

                {/* Render as soon as we have at least artists for the active period */}
                {artists.length > 0 && (
                    <>
                        {/* Period tabs */}
                        <div className="period-tabs">
                            {Object.entries(PERIOD_LABELS).map(([key, label]) => (
                                <button
                                    key={key}
                                    className={`period-tab${activePeriod === key ? ' active' : ''}`}
                                    onClick={() => setActivePeriod(key)}
                                >
                                    {label}
                                    {!allStats[key]?.length && <span className="tab-loading"> …</span>}
                                </button>
                            ))}
                        </div>

                        {/* Summary bar */}
                        <div className="period-summary">
                            <div className="summary-item">
                                <span className="summary-value">{periodTotal.toLocaleString()}</span>
                                <span className="summary-label">plays (top 10)</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-value">{artists[0]?.name || '—'}</span>
                                <span className="summary-label">#1 artist</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-value">{tracks[0]?.name || '—'}</span>
                                <span className="summary-label">#1 track</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-value">{albums[0]?.name || '—'}</span>
                                <span className="summary-label">#1 album</span>
                            </div>
                        </div>

                        {/* Content tabs */}
                        <div className="content-tabs">
                            {['artists', 'albums', 'tracks'].map(t => (
                                <button
                                    key={t}
                                    className={`content-tab${activeTab === t ? ' active' : ''}`}
                                    onClick={() => setActiveTab(t)}
                                >
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Artists */}
                        {activeTab === 'artists' && (
                            <div className="main-grid">
                                <div className="card">
                                    <h2 className="card-title">Top Artists</h2>
                                    {artists.map((artist, i) => (
                                        <ArtistBar key={artist.name} artist={artist} index={i} maxPlays={maxPlays} />
                                    ))}
                                </div>
                                <div className="right-col">
                                    {rising.length > 0 && (
                                        <div className="card">
                                            <h2 className="card-title">↑ Rising</h2>
                                            <p className="card-desc">New to your top 5, absent from 12-month history.</p>
                                            <div className="tag-row">
                                                {rising.map(name => <span key={name} className="tag tag-rising">{name}</span>)}
                                            </div>
                                            <p className="action-hint">→ Dig into their back catalogue.</p>
                                        </div>
                                    )}
                                    {dropped.length > 0 && (
                                        <div className="card">
                                            <h2 className="card-title">↓ Faded</h2>
                                            <p className="card-desc">Were in your 12-month top 5, dropped off recently.</p>
                                            <div className="tag-row">
                                                {dropped.map(name => <span key={name} className="tag tag-faded">{name}</span>)}
                                            </div>
                                            <p className="action-hint">→ Worth revisiting? Or a chapter closed.</p>
                                        </div>
                                    )}
                                    {recent.length > 0 && (
                                        <div className="card">
                                            <h2 className="card-title">Recently Played</h2>
                                            {recent.slice(0, 6).map((track, i) => {
                                                const isNow = track['@attr']?.nowplaying === 'true';
                                                const cover = getImg(track, 'medium');
                                                return (
                                                    <div key={i} className="recent-row">
                                                        {cover
                                                            ? <img src={cover} alt="" className="recent-thumb" />
                                                            : <div className="recent-thumb recent-thumb-empty" />
                                                        }
                                                        <div className="recent-info">
                                                            <span className="recent-name">{track.name}</span>
                                                            <span className="recent-artist">{track.artist?.['#text']}</span>
                                                        </div>
                                                        {isNow && <span className="now-badge">▶ NOW</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Albums */}
                        {activeTab === 'albums' && (
                            <div className="card">
                                <h2 className="card-title">Top Albums — {PERIOD_LABELS[activePeriod]}</h2>
                                {albums.length > 0
                                    ? <AlbumGrid albums={albums} />
                                    : <p className="card-desc">Loading albums…</p>
                                }
                            </div>
                        )}

                        {/* Tracks */}
                        {activeTab === 'tracks' && (
                            <div className="card">
                                <h2 className="card-title">Top Tracks — {PERIOD_LABELS[activePeriod]}</h2>
                                {tracks.length > 0
                                    ? <TrackList tracks={tracks} />
                                    : <p className="card-desc">Loading tracks…</p>
                                }
                            </div>
                        )}

                        {/* CTAs */}
                        <div className="cta-row">
                            <a href={`https://www.last.fm/user/${USER}`} target="_blank" rel="noopener noreferrer" className="cta-btn">
                                Full profile →
                            </a>
                            <a href={`https://www.last.fm/user/${USER}/library`} target="_blank" rel="noopener noreferrer" className="cta-btn secondary">
                                Full library →
                            </a>
                            <a href={`https://www.last.fm/user/${USER}/listening-report`} target="_blank" rel="noopener noreferrer" className="cta-btn secondary">
                                Annual report →
                            </a>
                        </div>

                        {lastUpdated && <p className="last-updated">Last updated: {lastUpdated}</p>}
                    </>
                )}

                {/* Empty state — nothing loaded yet and not loading */}
                {!loading && artists.length === 0 && (
                    <p className="lastfm-loading">Could not load data. Check your API key or try again.</p>
                )}
            </div>
        </>
    );
}
