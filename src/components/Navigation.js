import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
    return (
        <nav className="navigation">
            <ul>
                <li>
                    <Link to="/about">/about</Link>
                </li>
                <li>
                    <Link to="/publications">/publications</Link>
                </li>
                <li>
                    <Link to="/contact">/contact</Link>
                </li>
                <li>
                    <Link to="/defense">/defense</Link>
                </li>
                <li>
                    <a
                        href="https://khatalist.nl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-external"
                        title="KHATALIST — the alter ego"
                    >
                        /alter-ego
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;
