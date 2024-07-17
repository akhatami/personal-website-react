import React from 'react';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faMusic, faRunning, faBiking, faCamera, faChess, faPen } from '@fortawesome/free-solid-svg-icons';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import Navigation from "./Navigation";

const Interests = () => {
    return (
        <>
            <Navigation />
            <div className="home-page">
                <div className="content">
                    <p className="bio">
                        Beyond academia, I'm a{'  '}
                        <a href="/lastfm-stats">
                            metalcore/deathcore/hardcore music enthusiast
                            {'  '}<FontAwesomeIcon icon={faMusic} />{' '}
                        </a>{' '}
                        and enjoy{' '}
                        <span>
                            running{' '}<FontAwesomeIcon icon={faRunning} />
                        </span>
                        ,{' '}
                        <span>
                            cycling{' '}<FontAwesomeIcon icon={faBiking} />
                        </span>
                        ,{' '}
                        <span>
                            photography{' '}<FontAwesomeIcon icon={faCamera} />
                        </span>
                        ,{' '}
                        <span>
                            chess{' '}<FontAwesomeIcon icon={faChess} />
                        </span>
                        , and{' '}
                        <span>
                            writing{' '}<FontAwesomeIcon icon={faPen} />
                        </span>
                        .
                    </p>
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

export default Interests;
