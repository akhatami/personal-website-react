import React from 'react';
import Navigation from './Navigation';
import './Contact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const Contact = () => {
    return (
        <>
            <Navigation />
            <section className="contact">
                <div className="contact-inner">
                    <p className="contact-label">Contact</p>
                    <h1 className="contact-title">GET IN TOUCH</h1>
                    <p className="contact-desc">
                        Open to research collaborations, questions about my work,<br />
                        or just a conversation about software engineering.
                    </p>

                    <div className="contact-methods">
                        <a href="mailto:s.khatami@tudelft.nl" className="contact-method primary">
                            <FontAwesomeIcon icon={faEnvelope} />
                            <span className="method-label">Email</span>
                            <span className="method-value">s.khatami@tudelft.nl</span>
                        </a>
                        <a href="https://www.linkedin.com/in/alikhatami/" target="_blank" rel="noopener noreferrer" className="contact-method">
                            <FontAwesomeIcon icon={faLinkedin} />
                            <span className="method-label">LinkedIn</span>
                            <span className="method-value">/in/alikhatami</span>
                        </a>
                    </div>

                    <div className="contact-divider" />

                    <div className="contact-also">
                        <span className="contact-also-label">Also find me on</span>
                        <div className="contact-also-links">
                            <a href="https://github.com/akhatami" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faGithub} /> GitHub
                            </a>
                            <a href="https://scholar.google.com/citations?user=ax4ieSsAAAAJ&hl=en&oi=sra" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faGraduationCap} /> Google Scholar
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contact;
