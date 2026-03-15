import React, { useState } from 'react';
import './ProjectCard.css';

interface Metric {
  value: string;
  label: string;
}

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
  metrics?: Metric[];
  phases?: string[];
  role?: string;
  problem?: string;
  solution?: string;
  figmaLink?: string;
  category?: string;
  index?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title, subtitle, description, image, tags, fullDetails,
  link, webLink, reverse, metrics, phases, role, problem, solution, figmaLink, category, index = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFigma, setShowFigma] = useState(false);

  return (
    <article className={`project-card ${reverse ? 'reverse' : ''}`} style={{ '--card-index': index } as React.CSSProperties}>
      
      {/* Category Badge */}
      {category && (
        <div className="project-category-badge">{category}</div>
      )}

      <div className={`project-inner ${reverse ? 'reverse' : ''}`}>
        {/* ── IMAGE COLUMN ── */}
        <div className="project-image-column">
          <div className="project-image-wrapper">
            <img src={image} alt={title} className="project-image" loading="lazy" decoding="async" />
            <div className="project-image-overlay">
              {figmaLink && (
                <button className="overlay-btn" onClick={() => setShowFigma(true)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Preview Prototype
                </button>
              )}
            </div>
          </div>

          {/* Metrics Row */}
          {metrics && (
            <div className="project-metrics">
              {metrics.map((m, i) => (
                <div className="metric-item" key={i}>
                  <strong className="metric-value">{m.value}</strong>
                  <span className="metric-label">{m.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Phase Tracker */}
          {phases && (
            <div className="phase-tracker">
              {phases.map((phase, i) => (
                <React.Fragment key={i}>
                  <span className="phase-step">{phase}</span>
                  {i < phases.length - 1 && <span className="phase-arrow">→</span>}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Action Links */}
          {(link || webLink) && (
            <div className="project-link-container">
              {link && (
                <a href={link} target="_blank" rel="noopener noreferrer" className="project-link-btn btn-outline">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Live Prototype
                </a>
              )}
              {webLink && (
                <a href={webLink} target="_blank" rel="noopener noreferrer" className="project-link-btn btn-primary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  Live Site
                </a>
              )}
            </div>
          )}
        </div>

        {/* ── CONTENT COLUMN ── */}
        <div className="project-content">
          <h3 className="project-title">{title}</h3>
          {subtitle && <p className="project-subtitle">{subtitle}</p>}

          <div className="project-tags">
            {tags.map((tag, i) => (
              <span key={i} className="tag">{tag}</span>
            ))}
          </div>

          <p className="project-description">{description}</p>

          {/* My Role */}
          {role && (
            <div className="project-role">
              <span className="role-label">My Role</span>
              <p className="role-text">{role}</p>
            </div>
          )}

          {/* Problem / Solution Summary */}
          {(problem || solution) && !isExpanded && (
            <div className="project-ps-row">
              {problem && (
                <div className="ps-block problem-block">
                  <span className="ps-label">⚠ Problem</span>
                  <p>{problem}</p>
                </div>
              )}
              {solution && (
                <div className="ps-block solution-block">
                  <span className="ps-label">✦ Solution</span>
                  <p>{solution}</p>
                </div>
              )}
            </div>
          )}

          {/* Expandable Full Case Study */}
          <div className={`project-details ${isExpanded ? 'expanded' : ''}`}>
            {fullDetails}
          </div>

          <button className="read-more-btn" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? (
              <>Show Less <span>↑</span></>
            ) : (
              <>Read Full Case Study <span>↓</span></>
            )}
          </button>
        </div>
      </div>

      {/* Figma Preview Modal */}
      {showFigma && figmaLink && (
        <div className="figma-modal-overlay" onClick={() => setShowFigma(false)}>
          <div className="figma-modal" onClick={e => e.stopPropagation()}>
            <div className="figma-modal-header">
              <span className="figma-modal-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M9 3v18"/><path d="M3 9h18"/>
                </svg>
                {title} — Interactive Prototype
              </span>
              <button className="figma-close-btn" onClick={() => setShowFigma(false)} aria-label="Close prototype">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="figma-embed-wrap">
              <iframe
                src={figmaLink}
                className="figma-iframe"
                allowFullScreen
                title={`${title} Figma Prototype`}
              />
            </div>
            <div className="figma-modal-footer">
              <a href={figmaLink} target="_blank" rel="noopener noreferrer" className="figma-open-link">
                Open in Figma ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default ProjectCard;
