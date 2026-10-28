import React from 'react';

const About = () => (
    <section className="about">
        <h2>About Me</h2>
        <div className="bio">
            <p>
                I’m a generalist engineer who enjoys figuring out how things work and building tools that make
                people’s work easier. My work spans software engineering, data, analytics, and AI, from building
                systems and data pipelines to integrating AI agents into software development workflows.
            </p>
            <p>
                A lot of my approach comes from my PhD research at TU Delft, where I studied how open-source teams
                use testing, code review, and CI/CD in practice. It made me interested in more than the technology
                itself: how people use it, where they get stuck, and what makes a tool impactful in their
                day-to-day work.
            </p>
            <p>
                At{' '}
                <a href="https://www.tudelft.nl/" target="_blank" rel="noopener noreferrer">TU Delft’s</a>{' '}
                <a href="https://www.tudelft.nl/bk/onderzoek/bk-labs/data-refinery-lab"
                   target="_blank" rel="noopener noreferrer">Data Refinery Lab</a>, I build data infrastructure
                and tools that support research on the built environment. I work across the full process, from
                collecting and organising data to making it accessible through analytics, dashboards, and
                decision-support tools.
            </p>
            <p>
                Whether I’m working with research data, AI systems, or developer tools, I enjoy connecting the
                pieces, understanding the problem, and building something people can put to use.
            </p>
            <p>
                Interested in my research or publications?{' '}
                <a href="/publications" target="_blank" rel="noopener noreferrer">Check them out here!</a>
            </p>
        </div>
    </section>
);

export default About;
