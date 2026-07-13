import React, { useEffect } from 'react';

const langMeta = {
    all: { label: 'All Languages', flag: '🌐' },
    en:  { label: 'English',       flag: '🇬🇧' },
    ar:  { label: 'Arabic',        flag: '🇸🇦' },
    zh:  { label: 'Chinese',       flag: '🇨🇳' },
    ja:  { label: 'Japanese',      flag: '🇯🇵' }
};

function Lightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return;

    // Disable background scrolling when open
    document.body.style.overflow = 'hidden';
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const meta = langMeta[item.language] || langMeta.en;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('lightbox-overlay')) {
      onClose();
    }
  };

  return (
    <div className="lightbox-overlay" onClick={handleOverlayClick}>
        <div className="lightbox">
            <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
            <div className="lightbox-image-wrap">
                <img src={item.image} alt={item.title} className="lightbox-image" />
            </div>
            <div className="lightbox-info">
                <h3 className="lightbox-title">{item.title}</h3>
                <p className="lightbox-desc">{item.description}</p>
                <div className="lightbox-meta">
                    <span className="lightbox-category">{item.category.toUpperCase()}</span>
                    {item.language && (
                      <span className="lightbox-lang">{meta.flag} {meta.label}</span>
                    )}
                    <span className="lightbox-tags">{item.tags.join(' · ')}</span>
                </div>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="lightbox-open-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    Open in New Tab
                </a>
            </div>
        </div>
    </div>
  );
}

export default Lightbox;
