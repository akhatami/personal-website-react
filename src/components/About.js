import React from 'react';

const About = () => (
    <section className="about">
        <h2>About Me</h2>
        <div className="bio">
            <p>
                I'm a generalist (software, data, AI, analytics) engineer working at the intersection of software engineering, data,
                analytics, and AI. I build software systems, design data pipelines, turn raw data into actionable
                insights, and develop the dashboards and tools that make those insights useful in solving real-world problems.
            </p>
            <p>
                At {' '}
                <a href="https://www.tudelft.nl/" target="_blank" rel="noopener noreferrer">TU Delft's</a>{' '}
                <a href="https://www.tudelft.nl/bk/onderzoek/bk-labs/data-refinery-lab"
                   target="_blank" rel="noopener noreferrer">Data Refinery Lab</a>{' '}
                — part of the <a href="https://www.tudelft.nl/bk/over-faculteit/afdelingen/architecture/organisatie-1/secties-en-groepen-nieuw/building-knowledge/design-data-and-society-group"
                                 target="_blank" rel="noopener noreferrer">Design, Data & Society</a>{' '}
                group within the{' '}
                <a href="https://www.tudelft.nl/en/architecture-and-the-built-environment"
                   target="_blank" rel="noopener noreferrer">Faculty of Architecture and the Built Environment</a>{' '}
                — I develop the data infrastructure that powers research on the built environment, from data ingestion
                and engineering to analytics and decision-support tools.
            </p>
            <p>
                I'm also soon defending my PhD in Software Engineering at TU Delft under the supervision of
                Prof. <a href="https://azaidman.github.io/" target="_blank" rel="noopener noreferrer">Andy Zaidman</a>,
                with the thesis{' '}
                <em>Understanding Software Quality Assurance in Open-Source Communities: Awareness, Adoption, and Tool Utilization</em>.
                My research investigates how software teams adopt and use quality assurance practices at scale — including
                CI/CD, automated testing, and code review across the GitHub ecosystem. Through large-scale empirical studies,
                I've developed an evidence-based perspective on how quality assurance practices are adopted in the real world,
                what separates successful implementations from unsuccessful ones, and how organizations can turn engineering
                best practices into measurable outcomes.
            </p>
            <p>
                More recently, I've focused on AI engineering — building (intelligent) systems and integrating AI agents
                into software engineering workflows. Across all my work, the goal remains the same: understand how
                complex systems (including humans) operate in the real world and build technology that makes
                them more effective.
            </p>
            <p>
                Interested in my research or publications?{' '}
                <a href="/publications" target="_blank" rel="noopener noreferrer">Check them out here!</a>
            </p>
        </div>
    </section>
);

export default About;
