import React, { useState } from 'react';
import './ProjectCard.css';

interface ProjectCardProps {
    title: string;
    subtitle?: string;
    description: string;
    image: string;
    tags: string[];
    fullDetails: React.ReactNode;
    link?: string;
    webLink?: string;
    reverse?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    title,
    subtitle,
    description,
    image,
    tags,
    fullDetails,
    link,
    webLink,
    reverse
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`project-card ${reverse ? 'reverse' : ''}`}>
            <div className="project-image-wrapper">
                <img src={image} alt={title} className="project-image" loading="lazy" decoding="async" />
            </div>
            <div className="project-content">
                <h3 className="project-title">{title}</h3>
                {subtitle && <h4 className="project-subtitle">{subtitle}</h4>}

                <div className="project-tags">
                    {tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                    ))}
                </div>

                <p className="project-description">{description}</p>

                <div className={`project-details ${isExpanded ? 'expanded' : ''}`}>
                    {fullDetails}

                    {(link || webLink) && (
                        <div className="project-link-container">
                            {link && (
                                <a href={link} target="_blank" rel="noopener noreferrer" className="project-link-btn">
                                    View Figma Prototype
                                </a>
                            )}
                            {webLink && (
                                <a href={webLink} target="_blank" rel="noopener noreferrer" className="project-link-btn">
                                    View Live Website
                                </a>
                            )}
                        </div>
                    )}
                </div>

                <button
                    className="read-more-btn"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? 'Show Less' : 'Read More'}
                </button>
            </div>
        </div>
    );
};

export default ProjectCard;
