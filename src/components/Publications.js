import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import  Navigation  from './Navigation';
import './Publications.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub, faLinkedin} from "@fortawesome/free-brands-svg-icons";
import {faVideo, faBook, faGraduationCap, faDatabase, faFileAlt, faLink, faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
const Publications = ({publication}) => {
    const [expandedSummaries, setExpandedSummaries] = useState({});
    const [parsedSummaries, setParsedSummaries] = useState({});

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const publications = [
        {
            id: 1,
            title: 'Software Quality Assurance Analytics: Enabling Software Engineers to Reflect on QA Practices',
            authors: 'Ali Khatami, Carolin Brandt, Andy Zaidman',
            venue: 'IEEE 24th International Working Conference on Source Code Analysis and Manipulation (SCAM)',
            year: 2024,
            prePrint: 'https://azaidman.github.io/publications/khatamiSCAM2024a.pdf',
            video: 'https://drive.google.com/file/d/1ZiXGRMzfHxszokLVm5oPOWbUPcljMDyh/view?usp=sharing',
            replication: 'https://zenodo.org/records/10961021',
            summaryFile: '/summaries/qaa-repoinsights.md',
        },
        {
            id: 2,
            title: 'Catching Smells in the Act: A GitHub Actions Workflow Investigation',
            authors: 'Ali Khatami, Cédric Willekens, Andy Zaidman',
            venue: 'IEEE 24th International Working Conference on Source Code Analysis and Manipulation (SCAM)',
            year: 2024,
            prePrint: 'https://azaidman.github.io/publications/khatamiSCAM2024b.pdf',
            video: 'https://drive.google.com/file/d/1nlePx_q9vIDHVaQopmuu8QsCSHxQe8S5/view?usp=sharing',
            replication: 'https://zenodo.org/records/12207164',
            summaryFile: '/summaries/catching-gha-smells.md',
        },
        {
            id: 3,
            title: 'State‐of‐the‐Practice in Quality Assurance in Java‐Based Open Source Software Development',
            authors: 'Ali Khatami, Andy Zaidman',
            venue: 'Software: Practice and Experience',
            year: 2024,
            prePrint: 'https://azaidman.github.io/publications/khatamiSPE2024.pdf',
            doi: 'https://doi.org/10.1002/spe.3321',
            replication: 'https://zenodo.org/records/7404903',
            summaryFile: '/summaries/qa-java-oss.md',
        },
        {
            id: 4,
            title: 'Shaken, Not Stirred. How Developers Like Their Amplified Tests',
            authors: 'Carolin Brandt, Ali Khatami, Mairieli Wessel, Andy Zaidman',
            venue: 'IEEE Transactions on Software Engineering',
            year: 2024,
            doi: 'https://doi.org/10.1109/TSE.2024.3381015',
            prePrint: 'https://azaidman.github.io/publications/brandtTSE2024.pdf',
            replication: 'https://zenodo.org/records/7685478',
            summaryFile: '/summaries/amplified-tests.md',
        },
        {
            id: 5,
            title: 'Quality Assurance Awareness in Open Source Software Projects on GitHub',
            authors: 'Ali Khatami, Andy Zaidman',
            venue: 'IEEE 23rd International Working Conference on Source Code Analysis and Manipulation (SCAM)',
            year: 2023,
            prePrint: 'https://azaidman.github.io/publications/khatamiSCAM2023.pdf',
            doi: 'https://doi.org/10.1109/SCAM59687.2023.00027',
            replication: 'https://zenodo.org/records/8139381',
            summaryFile: '/summaries/qa-awareness-oss.md',
        },
    ];

    useEffect(() => {
        const fetchSummaries = async () => {
            for (const pub of publications) {
                if (pub.summaryFile) {
                    console.log(pub.summaryFile);
                    try {
                        const response = await fetch(pub.summaryFile);
                        console.log(response);
                        const content = await response.text();
                        const parsed = parseMarkdown(content);
                        setParsedSummaries(prev => ({ ...prev, [pub.id]: parsed }));
                    } catch (error) {
                        console.error(`Error fetching summary for publication ${pub.id}:`, error);
                    }
                }
            }
        };

        fetchSummaries();
    }, [publications]);

    const parseMarkdown = (md) => {
        const tokens = marked.lexer(md);
        const sections = [];
        let currentSection = null;

        tokens.forEach(token => {
            if (token.type === 'heading' && token.depth === 2) {
                if (currentSection) {
                    sections.push(currentSection);
                }
                currentSection = { title: token.text, content: '' };
            } else if (currentSection) {
                currentSection.content += token.raw;
            }
        });

        if (currentSection) {
            sections.push(currentSection);
        }

        return sections;
    };

    const toggleSummary = (id) => {
        setExpandedSummaries(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <>
            <Navigation />
            <div className="publications-page">
                <div className="content">
                    {publications.map((publication) => (
                        <div key={publication.id} className="publication">
                            <h3><FontAwesomeIcon icon={faBook} />{' '}{publication.title}</h3>
                            <p>{publication.authors}</p>
                            <p>{publication.venue}</p>
                            <p>{publication.year}</p>
                            <div className="publication-links">
                                {publication.doi && (
                                    <a href={publication.doi} target="_blank" rel="noopener noreferrer">
                                        <FontAwesomeIcon icon={faLink} /> DOI
                                    </a>
                                )}
                                {publication.prePrint && (
                                    <a href={publication.prePrint} target="_blank" rel="noopener noreferrer">
                                        <FontAwesomeIcon icon={faFileAlt} /> Pre-print
                                    </a>
                                )}
                                {publication.video && (
                                    <a href={publication.video} target="_blank" rel="noopener noreferrer">
                                        <FontAwesomeIcon icon={faVideo} /> Presentation
                                    </a>
                                )}
                                {publication.replication && (
                                    <a href={publication.replication} target="_blank" rel="noopener noreferrer">
                                        <FontAwesomeIcon icon={faDatabase} /> Replication Package
                                    </a>
                                )}
                            </div>
                            {parsedSummaries[publication.id] && (
                                <div className="summary-section">
                                    <button onClick={() => toggleSummary(publication.id)} className="summary-toggle">
                                        {expandedSummaries[publication.id] ? 'Hide' : 'Show'} Summary{' '}
                                        <FontAwesomeIcon icon={expandedSummaries[publication.id] ? faChevronUp : faChevronDown} />
                                    </button>
                                    {expandedSummaries[publication.id] && (
                                        <div className="summary-content">
                                            <h4>Research Summary</h4>
                                            {parsedSummaries[publication.id].map((section, index) => (
                                                <div key={index} className="summary-text-section">
                                                    <h5>{section.title}</h5>
                                                    <div dangerouslySetInnerHTML={{ __html: marked(section.content) }} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
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
                            <FontAwesomeIcon icon={faGraduationCap} />
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Publications;
