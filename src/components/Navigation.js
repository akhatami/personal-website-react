import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import './Navigation.css';

const Navigation = () => {
    // Phones only: the five items do not fit one line, so they collapse behind
    // this toggle. On wider screens the CSS hides the button and the list is
    // always a row, so the state is simply never used.
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);

    return (
        <nav className="navigation">
            <button
                type="button"
                className="nav-toggle"
                aria-expanded={open}
                aria-controls="nav-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
                onClick={() => setOpen((v) => !v)}
            >
                <FontAwesomeIcon icon={open ? faXmark : faBars} />
                <span>Menu</span>
            </button>

            <ul id="nav-menu" className={open ? 'open' : ''}>
                <li>
                    <Link to="/about" onClick={close}>/about</Link>
                </li>
                <li>
                    <Link to="/publications" onClick={close}>/publications</Link>
                </li>
                <li>
                    <Link to="/contact" onClick={close}>/contact</Link>
                </li>
                <li>
                    <Link to="/defense" onClick={close}>/defense</Link>
                </li>
                <li>
                    <a
                        href="https://khatalist.nl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-external"
                        title="KHATALIST — the alter ego"
                        onClick={close}
                    >
                        /alter-ego
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;
