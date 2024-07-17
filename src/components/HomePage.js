import React from 'react';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faBook, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import Navigation from "./Navigation";
const HomePage = () => {

    return (
        <>
            <Navigation />
            <div className="home-page">
                <div className="content">
                    <div className="intro-image">
                        <h1 className="name">Ali Khatami</h1>
                        <p className="tagline">PhD Candidate in Software Engineering<br />Delft University of Technology</p>
                    </div>
                        <div className="intro-text">
                            <p className="bio">
                                As a PhD candidate in the Software Engineering Research Group (SERG) at TU Delft, I'm passionate about empowering software developers to
                                create high-quality software. My research focuses on software quality analytics by providing developers with
                                actionable insights and raising their situational awareness of quality assurance practices.
                                My goal is to equip software engineers with the tools and knowledge they need to make data-driven decisions, optimize their QA processes,
                                and consistently deliver high-quality software. <br />
                                <a href="/interests">Me beyond academy</a>
                            </p>
                        </div>
                <div className="info-container">
                    <div className="research-interests">
                        <h2><FontAwesomeIcon icon={faBook} /> Research Interests</h2>
                        <ul>
                            <li>Software Quality Assurance</li>
                            <li>Software Analytics</li>
                            <li>Empirical Software Engineering</li>
                            <li>Software Evolution</li>
                            <li>Software Testing</li>
                        </ul>
                    </div>
                    <div className="education">
                        <h2><FontAwesomeIcon icon={faGraduationCap} /> Education</h2>
                        <ul>
                            <li>
                                <i>PhD in Software Engineering, 2025</i>
                                <div className="description">Delft University of Technology</div>
                            </li>
                            <li>
                                <i>MSc in Software Engineering, 2021</i>
                                <div className="description">Sharif University of Technology</div>
                            </li>
                            <li>
                                <i>Bachelor in Software Engineering, 2017</i>
                                <div className="description">Azad University, South-Tehran branch</div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="social-links">
                    <a href="https://github.com/akhatami" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faGithub} />
                    </a>
                    <a href="https://www.linkedin.com/in/alikhatami/" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                    <a href="https://scholar.google.com/citations?user=ax4ieSsAAAAJ&hl=en&oi=sra" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faGraduationCap} />
                    </a>
                </div>
            </div>
        </div>
        </>
    );
};

export default HomePage;
