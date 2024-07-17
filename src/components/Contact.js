import React from 'react';
import Navigation from './Navigation';
import './Contact.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub, faLinkedin} from "@fortawesome/free-brands-svg-icons";
import {faGraduationCap} from "@fortawesome/free-solid-svg-icons";

const Contact = () => {
    return (
        <>
            <Navigation />
            <div className="contact-page">
                <div className="contact-content">
                    {/*<h2>Contact</h2>*/}
                    <p>You can reach out to me by sending an email to: s.khatami [at] tudelft.nl </p>
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

export default Contact;
