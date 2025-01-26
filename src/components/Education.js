// Education.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const Education = () => {
    return (
        <div className="education">
            <h2><FontAwesomeIcon icon={faGraduationCap} /> Education</h2>
            <ul>
                <li>
                    <i>PhD in Software Engineering, 2025</i>
                    <div className="description">Delft University of Technology, NL</div>
                </li>
                <li>
                    <i>MSc in Software Engineering, 2021</i>
                    <div className="description">Sharif University of Technology, IR</div>
                </li>
                <li>
                    <i>BSc in Software Engineering, 2017</i>
                    <div className="description">Azad University South Tehran Branch, IR</div>
                </li>
            </ul>
        </div>
    );
};

export default Education;
