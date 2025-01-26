// Projects.js
import React from 'react';

const projectsData = [
    {
        title: "Test",
        description: "test.",
        githubLink: "test",
        liveDemo: "test"
    },
    // Add more projects as needed
];

const Projects = () => {
    return (
        <section className="projects">
            <h2>Projects</h2>
            <div className="projects-container">
                {projectsData.map((project, index) => (
                    <div key={index} className="project-card">
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <div className="project-links">
                            {project.githubLink && (
                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer">GitHub</a>
                            )}
                            {project.liveDemo && (
                                <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">Live Demo</a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Projects;
