import React from 'react';
import './HomePage.css';
import Navigation from "./Navigation";
import About from "./About";
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

                    {/* Right: bio */}
                    <div className="intro-text">
                        <About />
                    </div>

                    {/* Right: footer line */}
                    <div className="invitation">
                        <p>
                            For updated experience and education, visit my{' '}
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
