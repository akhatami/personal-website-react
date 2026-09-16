import React from 'react';
import './HomePage.css';
import Navigation from "./Navigation";
import About from "./About";
import { Link } from 'react-router-dom';
import SocialLinks from "./SocialLinks";

const HomePage = () => {
    return (
        <>
            <Navigation />
            <section className="home-page">
                <div className="content">

                    {/* Left: identity column */}
                    <div className="intro-image">
                        <img src="avatar-personal.jpeg" alt="Ali Khatami" className="profile-photo" />
                        <h1 className="name">Ali Khatami</h1>
                        <p className="tagline">Data Engineer<br />PhD Candidate</p>
                        <div className="identity-meta">
                            <span className="identity-meta-item">TU Delft</span>
                            <span className="identity-meta-item">Delft, NL</span>
                            <span className="identity-meta-item">Software Engineering</span>
                        </div>
                    </div>

                    {/* Right: defense announcement */}
                    <Link to="/defense" className="defense-banner">
                        <span className="defense-banner-label">PhD Defense</span>
                        <span className="defense-banner-text">
                            23 October 2026, 12:30 — Aula, TU Delft. You are invited.
                        </span>
                        <span className="defense-banner-cta">RSVP →</span>
                    </Link>

                    {/* Right: bio */}
                    <div className="intro-text">
                        <About />
                    </div>

                    {/* Right: footer line */}
                    <div className="invitation">
                        <p>
                            For my full CV and work history, see my{' '}
                            <a href="https://www.linkedin.com/in/alikhatami/" target="_blank" rel="noopener noreferrer">
                                LinkedIn profile
                            </a>.
                        </p>
                    </div>

                </div>
                {/* Social links inside the page so it stays in viewport */}
                <SocialLinks />
            </section>
        </>
    );
};

export default HomePage;
