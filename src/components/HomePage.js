import React from 'react';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faBrain, faGraduationCap, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import Navigation from "./Navigation";
const HomePage = () => {

    return (
        <>
            <Navigation />
            <div className="home-page">
                <div className="content">
                    <div className="intro-image">
                        <h1 className="name">Ali Khatami</h1>
                        <p className="tagline">Software Engineer | Data Engineer | Full-Stack Developer
                            {/*<br />Delft University of Technology*/}
                        </p>
                    </div>
                        <div className="intro-text">
                            <p className="bio">
                               <p>
                                   Hi! I'm a <strong>software engineer</strong> and <strong>PhD candidate</strong> at TU Delft's Software Engineering Research Group. I combine <strong>software development</strong> expertise with research in <strong>software quality analytics</strong>.
                               </p>

                               <p>
                                   Through my work in both academia and industry, I have developed a unique perspective on building high-quality software systems, bringing together <strong>software engineering</strong> principles and <strong>data-driven approaches</strong>.
                               </p>

                               <p>
                                   I'm seeking <strong>Software Engineering / Data Engineering roles</strong> where I can create meaningful impact. Open to related opportunities in the Netherlands.
                               </p>
                                <a href="mailto:sakhaatami@gmail.com">
                                    Contact Me
                                </a>
                            </p>
                        </div>

                <div className="info-container">
                    <div className="research-interests">
                        <h2><FontAwesomeIcon icon={faBriefcase} /> Technical Exp</h2>
                        <ul>
                            <li>Build Data Analytics Dashboards</li>
                            <li>Developed API Integrations</li>
                            <li>Built Data Pipelines</li>
                            <li>Built Web Applications</li>
                        </ul>
                    </div>
                    <div className="research-interests">
                        <h2><FontAwesomeIcon icon={faBrain} /> Core Skills</h2>
                        <ul>
                            <li>Full-Stack Development</li>
                            <li>System Architecture</li>
                            <li>Problem-Solving Mindset</li>
                            <li>Data Engineering & Analytics</li>
                            <li>Fast Learner & Proactive</li>
                            <li>Team Collaboration</li>
                            <li>Communication</li>
                        </ul>
                    </div>
                    <div className="education">
                        <h2><FontAwesomeIcon icon={faGraduationCap} /> Education</h2>
                        <ul>
                            <li>
                                <i>PhD in Software Engineering, 2025</i>
                                <div className="description">Delft University of Technology, NL</div>
                            </li>
                            <li>
                                <i>MSc in Software Engineering, 2021</i>
                                <div className="description">Sharif University of Technology, IR</div>
                            </li>
                            <li>
                                <i>BSc in Software Engineering, 2017</i>
                                <div className="description">Azad University South Tehran Branch, IR</div>
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
