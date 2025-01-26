import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import {faGraduationCap} from "@fortawesome/free-solid-svg-icons";

const SocialLinks = () => (
    <section className="social-links">
        <a href="https://github.com/akhatami" target="_blank" rel="noopener noreferrer" title="GitHub">
            <FontAwesomeIcon icon={faGithub} size="1x" />
        </a>
        <a href="https://www.linkedin.com/in/alikhatami/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
            <FontAwesomeIcon icon={faLinkedin} size="1x" />
        </a>
        <a href="https://scholar.google.com/citations?user=ax4ieSsAAAAJ&hl=en&oi=sra" target="_blank" rel="noopener noreferrer" title="Google Scholar">
            <FontAwesomeIcon icon={faGraduationCap} size="1x" />
        </a>
        {/* Add more social links if necessary */}
    </section>
);

export default SocialLinks;
