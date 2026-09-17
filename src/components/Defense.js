import React, { useState } from 'react';
import Navigation from './Navigation';
import './Defense.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faClock, faLocationDot, faGlassCheers } from '@fortawesome/free-solid-svg-icons';

const GOOGLE_CALENDAR_URL =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent("Ali's PhD Defense") +
    '&dates=20261023T103000Z/20261023T120000Z' +
    '&details=' + encodeURIComponent(
        'PhD defense of Ali Khatami at TU Delft. Please be seated before 12:30 — the doors close once the ceremony begins. Reception afterwards at the Aula.'
    ) +
    '&location=' + encodeURIComponent('Aula Congress Centre, Senaatszaal, Mekelweg 5, 2628 CC Delft, The Netherlands');

// Times are in UTC; 23 October 2026 is CEST (UTC+2), so 12:30 local = 10:30Z.
const ICS = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ali Khatami//PhD Defense//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:phd-defense-ali-khatami-20261023@khatami.dev',
    'DTSTAMP:20260916T000000Z',
    'DTSTART:20261023T103000Z',
    'DTEND:20261023T120000Z',
    "SUMMARY:Ali's PhD Defense",
    'LOCATION:Aula Congress Centre\\, Senaatszaal\\, Mekelweg 5\\, 2628 CC Delft\\, The Netherlands',
    'DESCRIPTION:PhD defense of Ali Khatami at TU Delft. Please be seated before 12:30 — the doors close once the ceremony begins. Reception afterwards at the Aula.',
    'END:VEVENT',
    'END:VCALENDAR'
].join('\r\n');

const encode = (data) =>
    Object.keys(data)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');

const Defense = () => {
    const [form, setForm] = useState({ name: '', email: '', attending: 'yes', guests: '0', message: '' });
    const [status, setStatus] = useState('idle'); // idle | sending | sent | error

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        setStatus('sending');

        // Netlify Forms only exists on a deployed Netlify site; POST / is a 404
        // against the local dev server. Simulate a successful submit so the flow
        // can be reviewed locally.
        if (process.env.NODE_ENV === 'development') {
            console.log('[dev] RSVP would be submitted:', form);
            setTimeout(() => setStatus('sent'), 600);
            return;
        }

        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: encode({ 'form-name': 'defense-rsvp', ...form })
        })
            .then((res) => setStatus(res.ok ? 'sent' : 'error'))
            .catch(() => setStatus('error'));
    };

    const downloadIcs = () => {
        const blob = new Blob([ICS], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'phd-defense-ali-khatami.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <Navigation />
            <section className="defense">
                <div className="defense-hero">
                    <img
                        src="thesis-cover.jpg"
                        alt="The cover of the thesis: stone staircases rising through the dark toward a gold-topped summit"
                        className="defense-hero-image"
                    />
                    <div className="defense-hero-veil" />
                    <div className="defense-hero-copy">
                        <p className="defense-label">You are invited to</p>
                        <h1 className="defense-title">Ali's PhD Defense</h1>
                        <p className="defense-hero-meta">
                            <span>23 October 2026</span>
                            <span className="defense-hero-sep" />
                            <span>12:30</span>
                            <span className="defense-hero-sep" />
                            <span>Aula, TU Delft</span>
                        </p>
                    </div>
                    <p className="defense-hero-credit">From the cover of the thesis</p>
                </div>

                <div className="defense-inner">
                    <p className="defense-desc">
                        I will publicly defend my doctoral thesis at Delft University of Technology.
                        I would be delighted to have you there.
                    </p>

                    <div className="defense-thesis">
                        <span className="defense-thesis-label">Thesis</span>
                        <p className="defense-thesis-title">
                            Understanding Software Quality Assurance in Open-Source Communities:
                            Awareness, Adoption, and Tool Utilization
                        </p>
                        <p className="defense-thesis-meta">
                            Supervised by Prof.{' '}
                            <a href="https://azaidman.github.io/" target="_blank" rel="noopener noreferrer">
                                Andy Zaidman
                            </a>{' '}
                            and Dr.{' '}
                            <a href="https://carolin-brandt.de/" target="_blank" rel="noopener noreferrer">
                                Carolin Brandt
                            </a>
                        </p>
                    </div>

                    <div className="defense-details">
                        <div className="defense-detail">
                            <FontAwesomeIcon icon={faCalendarDays} />
                            <span className="detail-label">Date</span>
                            <span className="detail-value">Friday, 23 October 2026</span>
                        </div>
                        <div className="defense-detail">
                            <FontAwesomeIcon icon={faClock} />
                            <span className="detail-label">Time</span>
                            <span className="detail-value">12:30</span>
                        </div>
                        <div className="defense-detail">
                            <FontAwesomeIcon icon={faLocationDot} />
                            <span className="detail-label">Venue</span>
                            <span className="detail-value">
                                Senaatszaal, Aula Congress Centre
                                <span className="detail-value-sub">Mekelweg 5, 2628 CC Delft</span>
                            </span>
                        </div>
                        <div className="defense-detail">
                            <FontAwesomeIcon icon={faGlassCheers} />
                            <span className="detail-label">After</span>
                            <span className="detail-value">Reception at the Aula</span>
                        </div>
                    </div>

                    <p className="defense-note">
                        Please arrive in good time and be seated before 12:30 — the doors of the
                        Senaatszaal are closed once the ceremony begins and late arrivals cannot be admitted.
                    </p>

                    <div className="defense-actions">
                        <button type="button" onClick={downloadIcs} className="defense-action primary">
                            Add to calendar (.ics)
                        </button>
                        <a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="defense-action">
                            Google Calendar
                        </a>
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=Aula+Congress+Centre+TU+Delft+Mekelweg+5+Delft"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="defense-action"
                        >
                            Directions
                        </a>
                    </div>

                    <div className="defense-divider" />

                    <div className="rsvp">
                        <h2 className="rsvp-title">RSVP</h2>
                        <p className="rsvp-desc">
                            Please let me know whether you can make it — it helps a lot with the planning.
                        </p>

                        {status === 'sent' ? (
                            <div className="rsvp-thanks">
                                <p className="rsvp-thanks-title">Thank you, {form.name.split(' ')[0]}.</p>
                                <p>
                                    {form.attending === 'yes'
                                        ? 'Your RSVP is in — I look forward to seeing you on 23 October.'
                                        : 'Noted — I hope it works out. Let me know if things become clearer.'}
                                </p>
                            </div>
                        ) : (
                            <form
                                name="defense-rsvp"
                                method="POST"
                                data-netlify="true"
                                netlify-honeypot="bot-field"
                                onSubmit={handleSubmit}
                                className="rsvp-form"
                            >
                                <input type="hidden" name="form-name" value="defense-rsvp" />
                                <p className="rsvp-hp">
                                    <label>
                                        Leave this field empty
                                        <input name="bot-field" onChange={handleChange} />
                                    </label>
                                </p>

                                <label className="rsvp-field">
                                    <span className="rsvp-field-label">Name</span>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        required
                                    />
                                </label>

                                <label className="rsvp-field">
                                    <span className="rsvp-field-label">Email <em>(optional)</em></span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                    />
                                </label>

                                <fieldset className="rsvp-field rsvp-choice">
                                    <legend className="rsvp-field-label">Will you be there?</legend>
                                    <div className="rsvp-options">
                                        <label className={form.attending === 'yes' ? 'rsvp-option selected' : 'rsvp-option'}>
                                            <input
                                                type="radio"
                                                name="attending"
                                                value="yes"
                                                checked={form.attending === 'yes'}
                                                onChange={handleChange}
                                            />
                                            Yes, I'll be there
                                        </label>
                                        <label className={form.attending === 'maybe' ? 'rsvp-option selected' : 'rsvp-option'}>
                                            <input
                                                type="radio"
                                                name="attending"
                                                value="maybe"
                                                checked={form.attending === 'maybe'}
                                                onChange={handleChange}
                                            />
                                            Maybe
                                        </label>
                                    </div>
                                </fieldset>

                                {form.attending === 'yes' && (
                                    <label className="rsvp-field">
                                        <span className="rsvp-field-label">Guests joining you</span>
                                        <select name="guests" value={form.guests} onChange={handleChange}>
                                            <option value="0">Just me</option>
                                            <option value="1">+1</option>
                                            <option value="2">+2</option>
                                            <option value="3">+3</option>
                                        </select>
                                    </label>
                                )}

                                <label className="rsvp-field">
                                    <span className="rsvp-field-label">Message <em>(optional)</em></span>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Anything you'd like to add"
                                    />
                                </label>

                                <button type="submit" className="rsvp-submit" disabled={status === 'sending'}>
                                    {status === 'sending' ? 'Sending…' : 'Send RSVP'}
                                </button>

                                {status === 'error' && (
                                    <p className="rsvp-error">
                                        Something went wrong sending your RSVP. Please email me at{' '}
                                        <a href="mailto:sakhaatami@gmail.com">sakhaatami@gmail.com</a> instead.
                                    </p>
                                )}
                            </form>
                        )}
                    </div>

                    <div className="defense-divider" />

                    <p className="defense-footer">
                        Questions about the day? Reach me at{' '}
                        <a href="mailto:sakhaatami@gmail.com">sakhaatami@gmail.com</a>.
                    </p>
                </div>
            </section>
        </>
    );
};

export default Defense;
