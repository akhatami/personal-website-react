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
                {/* Hero Section */}
                <div className="content">
                    <div className="intro-image">
                        <img src="avatar-personal.jpg" alt="Ali Khatami" className="profile-photo" />
                        <h1 className="name">Ali Khatami</h1>
                        <p className="tagline">PhD Candidate & Data-Driven Software Engineer
                            {/*<br />Delft University of Technology*/}
                        </p>
                    </div>
                    <div className="intro-text">
                        {/* About Section */}
                        <About />
                    </div>
                    <div className="invitation">
                        <p>
                            For updated information about my experience and education, please visit my{' '}
                            <a href="https://www.linkedin.com/in/yourlinkedinprofile" target="_blank" rel="noopener noreferrer">
                                LinkedIn profile
                            </a>.
                        </p>
                    </div>

                    {/*</div>*/}
                {/* Projects Section */}
                {/*<Projects />*/}

                {/* Education Section */}
                {/*<Education />*/}
                {/*<div className="info-container">*/}
                {/*    <div className="research-interests">*/}
                {/*        <h2><FontAwesomeIcon icon={faBriefcase} /> Technical Exp</h2>*/}
                {/*        <ul>*/}
                {/*            <li>Designed and Implemented: </li>*/}
                {/*            <li>● Data analytics Dashboards</li>*/}
                {/*            <li>● API Integrations</li>*/}
                {/*            <li>● Data Analysis Pipelines</li>*/}
                {/*            <li>● Web Applications</li>*/}
                {/*        </ul>*/}
                {/*    </div>*/}
                {/*    <div className="research-interests">*/}
                {/*        <h2><FontAwesomeIcon icon={faBrain} /> Core Skills</h2>*/}
                {/*        <ul>*/}
                {/*            <li>Full-Stack Development</li>*/}
                {/*            <li>Software Architecture</li>*/}
                {/*            <li>Problem-Solving Mindset</li>*/}
                {/*            <li>Data Engineering & Analytics</li>*/}
                {/*            <li>Fast Learner & Proactive</li>*/}
                {/*            <li>Team Collaboration</li>*/}
                {/*            <li>Communication</li>*/}
                {/*        </ul>*/}
                {/*    </div>*/}
                {/*</div>*/}
                    {/* Social Links */}
                </div>
            </section>
                    <SocialLinks />
            {/*</div>*/}
        </>
    );
};

export default HomePage;
