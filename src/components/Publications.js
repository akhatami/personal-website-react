import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import Navigation from './Navigation';
import './Publications.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import {
    faVideo, faGraduationCap, faDatabase, faFileAlt,
    faLink, faChevronDown, faChevronUp, faSpinner
} from '@fortawesome/free-solid-svg-icons';

const publications = [
    {
        id: 1,
        title: 'Software Quality Assurance Analytics: Enabling Software Engineers to Reflect on QA Practices',
        authors: ['Ali Khatami', 'Carolin Brandt', 'Andy Zaidman'],
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
        authors: ['Ali Khatami', 'Cédric Willekens', 'Andy Zaidman'],
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
        authors: ['Ali Khatami', 'Andy Zaidman'],
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
        authors: ['Carolin Brandt', 'Ali Khatami', 'Mairieli Wessel', 'Andy Zaidman'],
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
        authors: ['Ali Khatami', 'Andy Zaidman'],
        venue: 'IEEE 23rd International Working Conference on Source Code Analysis and Manipulation (SCAM)',
        year: 2023,
        prePrint: 'https://azaidman.github.io/publications/khatamiSCAM2023.pdf',
        doi: 'https://doi.org/10.1109/SCAM59687.2023.00027',
        replication: 'https://zenodo.org/records/8139381',
        summaryFile: '/summaries/qa-awareness-oss.md',
    },
];

const OWN_NAME = 'Ali Khatami';

function AuthorList({ authors }) {
    return (
        <p className="pub-authors">
            {authors.map((name, i) => (
                <span key={name}>
                    {i > 0 && ', '}
                    {name === OWN_NAME
                        ? <span className="own-name">{name}</span>
                        : name}
                </span>
            ))}
        </p>
    );
}

export default function Publications() {
    const [expandedSummaries, setExpandedSummaries] = useState({});
    const [parsedSummaries, setParsedSummaries]     = useState({});
    const [loadingSummaries, setLoadingSummaries]   = useState({});

    useEffect(() => {
        const fetchSummaries = async () => {
            for (const pub of publications) {
                if (!pub.summaryFile) continue;
                setLoadingSummaries(prev => ({ ...prev, [pub.id]: true }));
                try {
                    const res     = await fetch(pub.summaryFile);
                    const content = await res.text();
                    const tokens  = marked.lexer(content);
                    const sections = [];
                    let current = null;
                    tokens.forEach(token => {
                        if (token.type === 'heading' && token.depth === 2) {
                            if (current) sections.push(current);
                            current = { title: token.text, content: '' };
                        } else if (current) {
                            current.content += token.raw;
                        }
                    });
                    if (current) sections.push(current);
                    setParsedSummaries(prev => ({ ...prev, [pub.id]: sections }));
                } catch (e) {
                    console.error(`Summary fetch failed for pub ${pub.id}:`, e);
                } finally {
                    setLoadingSummaries(prev => ({ ...prev, [pub.id]: false }));
                }
            }
        };
        fetchSummaries();
    }, []);

    const toggleSummary = (id) =>
        setExpandedSummaries(prev => ({ ...prev, [id]: !prev[id] }));

    return (
        <>
            <Navigation />
            <div className="publications-page">
                <div className="publications-wrap">

                    <h1 className="publications-heading">PUBLICATIONS</h1>
                    <p className="publications-subheading">Software Engineering · Empirical Research</p>

                    {publications.map((pub) => (
                        <div key={pub.id} className="publication">

                            {/* Year column */}
                            <div className="pub-year">{pub.year}</div>

                            {/* Body column */}
                            <div className="pub-body">
                                <h3 className="pub-title">{pub.title}</h3>
                                <AuthorList authors={pub.authors} />
                                <p className="pub-venue">{pub.venue}</p>

                                {/* Links + summary toggle on same row */}
                                <div className="publication-links">
                                    {pub.doi && (
                                        <a href={pub.doi} target="_blank" rel="noopener noreferrer" className="pub-link">
                                            <FontAwesomeIcon icon={faLink} /> DOI
                                        </a>
                                    )}
                                    {pub.prePrint && (
                                        <a href={pub.prePrint} target="_blank" rel="noopener noreferrer" className="pub-link">
                                            <FontAwesomeIcon icon={faFileAlt} /> Pre-print
                                        </a>
                                    )}
                                    {pub.video && (
                                        <a href={pub.video} target="_blank" rel="noopener noreferrer" className="pub-link">
                                            <FontAwesomeIcon icon={faVideo} /> Presentation
                                        </a>
                                    )}
                                    {pub.replication && (
                                        <a href={pub.replication} target="_blank" rel="noopener noreferrer" className="pub-link">
                                            <FontAwesomeIcon icon={faDatabase} /> Replication
                                        </a>
                                    )}

                                    {parsedSummaries[pub.id] && (
                                        <button
                                            onClick={() => toggleSummary(pub.id)}
                                            className="summary-toggle"
                                            disabled={loadingSummaries[pub.id]}
                                        >
                                            {loadingSummaries[pub.id] ? (
                                                <FontAwesomeIcon icon={faSpinner} spin />
                                            ) : (
                                                <>
                                                    {expandedSummaries[pub.id] ? 'Hide' : 'Summary'}
                                                    {' '}
                                                    <FontAwesomeIcon icon={expandedSummaries[pub.id] ? faChevronUp : faChevronDown} />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* Expanded summary */}
                                {expandedSummaries[pub.id] && parsedSummaries[pub.id] && (
                                    <div className="summary-content">
                                        <h4>Research Summary</h4>
                                        {parsedSummaries[pub.id].map((section, i) => (
                                            <div key={i} className="summary-text-section">
                                                <h5>{section.title}</h5>
                                                <div dangerouslySetInnerHTML={{ __html: marked(section.content) }} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Footer social links */}
                    <div className="social-links">
                        <a href="https://github.com/akhatami" target="_blank" rel="noopener noreferrer" title="GitHub">
                            <FontAwesomeIcon icon={faGithub} />
                        </a>
                        <a href="https://www.linkedin.com/in/alikhatami/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                            <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                        <a href="https://scholar.google.com/citations?user=ax4ieSsAAAAJ&hl=en&oi=sra" target="_blank" rel="noopener noreferrer" title="Google Scholar">
                            <FontAwesomeIcon icon={faGraduationCap} />
                        </a>
                    </div>

                </div>
            </div>
        </>
    );
}
