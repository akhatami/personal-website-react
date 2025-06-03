import React from 'react';

const About = () => (
    <section className="about">
        <h2>About Me</h2>
        <div className="bio">
            <p>
                Hi, I'm Ali! I’m a Data Engineer and Researcher at {' '}
                <a href="https://www.tudelft.nl/" target="_blank" rel="noopener noreferrer">TU Delft's</a>{' '}
                <a href="https://www.tudelft.nl/bk/onderzoek/bk-labs/data-refinery-lab"
                   target="_blank" rel="noopener noreferrer">Data Refinery Lab</a>{' '}
                , part of the <a href="https://www.tudelft.nl/bk/over-faculteit/afdelingen/architecture/organisatie-1/secties-en-groepen-nieuw/building-knowledge/design-data-and-society-group"
                                 target="_blank" rel="noopener noreferrer">Design, Data & Society</a>{' '}
                group within the{' '}
                <a href="https://www.tudelft.nl/en/architecture-and-the-built-environment"
                   target="_blank" rel="noopener noreferrer">Faculty of Architecture and the Built Environment</a>.
                My work focuses on
                developing data pipelines and analytics tools to support research on the built environment.
            </p>
            <p>
                In parallel, I’m completing my PhD in Software Engineering at TU Delft under the supervision of
                Prof. <a href="https://azaidman.github.io/" target="_blank" rel="noopener noreferrer">Andy Zaidman</a>. My research lies at the intersection of software analytics and software quality
                assurance—leveraging data-driven insights
                to help software engineers build more robust and maintainable software systems. Prior to my PhD, I earned my MSc
                in Software Engineering at Sharif University of Technology.
            </p>
            <p>
                Interested in my research or publications?{' '}
                <a href="/publications" target="_blank" rel="noopener noreferrer">Check them out here!</a>
            </p>
        </div>
    </section>
);

export default About;
