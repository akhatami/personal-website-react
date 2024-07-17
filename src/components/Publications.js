import React from 'react';
import  Navigation  from './Navigation';
import './Publications.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub, faGoogle, faLinkedin} from "@fortawesome/free-brands-svg-icons";
import {faBook} from "@fortawesome/free-solid-svg-icons";

const Publications = () => {
    const publications = [
        {
            title: 'State‐of‐the‐Practice in Quality Assurance in Java‐Based Open Source Software Development',
            authors: 'Ali Khatami, Andy Zaidman',
            venue: 'Software: Practice and Experience',
            year: 2024,
            link: 'https://doi.org/10.1002/spe.3321',
        },
        {
            title: 'Shaken, Not Stirred. How Developers Like Their Amplified Tests',
            authors: 'Carolin Brandt, Ali Khatami, Mairieli Wessel, Andy Zaidman',
            venue: 'IEEE Transactions on Software Engineering',
            year: 2024,
            link: 'https://doi.org/10.1109/TSE.2024.3381015',
        },
        {
            title: 'Quality Assurance Awareness in Open Source Software Projects on GitHub',
            authors: 'Ali Khatami, Andy Zaidman',
            venue: 'IEEE 23rd International Working Conference on Source Code Analysis and Manipulation (SCAM)',
            year: 2023,
            link: 'https://doi.org/10.1109/SCAM59687.2023.00027',
        },
    ];

    return (
        <>
            <Navigation/>
            <div className="publications-page">
                <div className="content">
                    {publications.map((publication, index) => (
                        <div key={index} className="publication">
                            <h3><FontAwesomeIcon icon={faBook} />{' '}{publication.title}</h3>
                            <p>
                                {/*<strong>Authors:</strong> */}
                                {publication.authors}
                            </p>
                            <p>
                                {/*<strong>Venue:</strong> */}
                                {publication.venue}
                            </p>
                            <p>
                                {/*<strong>Year:</strong> */}
                                {publication.year}
                            </p>
                            <p>
                                <a href={publication.link} target="_blank" rel="noopener noreferrer">
                                    {publication.link}
                                </a>
                            </p>
                        </div>
                    ))}
                    <div className="social-links">
                        <a href="https://github.com/akhatami" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faGithub} />
                        </a>
                        <a href="https://www.linkedin.com/in/alikhatami/" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                        <a href="https://scholar.google.com/citations?user=ax4ieSsAAAAJ&hl=en&oi=sra" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faGoogle} />
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Publications;
