import React from 'react';
import Navigation from './Navigation';
import './Contact.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faAt } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Contact = () => {
    return (
        <>
            <Navigation />
            <section className="contact">
                <h2>
                    <FontAwesomeIcon icon={faEnvelope} /> Get in Touch
                </h2>
                <p>
                    I'm open to new opportunities and collaborations. Whether you're looking to discuss a project, need assistance with software development, or want to connect professionally, feel free to reach out!
                </p>
                <div className="contact-links">
                    <a href="mailto:sakhaatami@gmail.com" className="contact-link">
                        <FontAwesomeIcon icon={faAt} /> Email Me {'  '}
                    </a>
                    <a href="https://www.linkedin.com/in/yourlinkedinprofile" target="_blank" rel="noopener noreferrer" className="contact-link">
                        <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
                    </a>
                </div>
            </section>
        </>
    );
};

export default Contact;
