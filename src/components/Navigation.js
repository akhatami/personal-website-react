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
            </ul>
        </nav>
    );
};

export default Navigation;
