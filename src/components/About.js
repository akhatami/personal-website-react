import React from 'react';

const About = () => (
    <section className="about">
        <h2>About Me</h2>
        <div className="bio">
            <p>
                Hi, I'm Ali! I’m wrapping up my PhD in Software Engineering at{' '}
                <a href="https://www.tudelft.nl/" target="_blank" rel="noopener noreferrer">TU Delft</a>, under the
                supervision of Prof. <a href="https://azaidman.github.io/" target="_blank" rel="noopener noreferrer">Andy Zaidman</a>.
                My research lies at the intersection of software analytics and software quality assurance—leveraging data-driven insights
                to help software engineers build more robust and maintainable software systems. Prior to my PhD, I earned my MSc
                in Software Engineering at Sharif University of Technology.
            </p>
            <p>
                While my background is rooted in cutting-edge research, I’m excited to apply these analytical and problem-solving
                skills in dynamic environments that foster continuous growth. I'm a curious individual who thrives on collaboration,
                aiming to make a lasting impact through innovative software solutions.
            </p>
            <p>
                Interested in my research or publications?{' '}
                <a href="/publications" target="_blank" rel="noopener noreferrer">Check them out here!</a>
            </p>
        </div>
    </section>
);

export default About;
