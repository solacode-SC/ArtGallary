import React, { useEffect, useState, useRef } from 'react';

const langMeta = {
    all: { label: 'All Languages', flag: '🌐' },
    en:  { label: 'English',       flag: '🇬🇧' },
    ar:  { label: 'Arabic',        flag: '🇸🇦' },
    zh:  { label: 'Chinese',       flag: '🇨🇳' },
    ja:  { label: 'Japanese',      flag: '🇯🇵' }
};

function Lightbox({ item, items = [], onClose, onNavigate }) {
  const [previewMode, setPreviewMode] = useState('live'); // 'live' | 'screen'
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);

  // Compute navigation
  const currentIndex = items.findIndex((i) => i.id === item?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < items.length - 1;

  const handlePrev = () => {
    if (hasPrev && onNavigate) {
      setIsIframeLoading(true);
      onNavigate(items[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext && onNavigate) {
      setIsIframeLoading(true);
      onNavigate(items[currentIndex + 1]);
    }
  };

  // Reset states when item changes
  useEffect(() => {
    if (item) {
      setIsIframeLoading(true);
      setCopied(false);
      setLiked(false);
    }
  }, [item?.id]);

  // Keyboard navigation & lock body scroll
  useEffect(() => {
    if (!item) return;

    document.body.style.overflow = 'hidden';
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        if (hasPrev) handlePrev();
      } else if (e.key === 'ArrowRight') {
        if (hasNext) handleNext();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, hasPrev, hasNext, currentIndex]);

  if (!item) return null;

  const meta = langMeta[item.language] || langMeta.en;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('lightbox-overlay')) {
      onClose();
    }
  };

  const handleReloadIframe = () => {
    setIsIframeLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleCopyLink = () => {
    const fullUrl = window.location.origin + (item.link.startsWith('/') ? item.link : `/${item.link}`);
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const parseLikesCount = (str) => {
    if (!str) return 0;
    const num = parseFloat(str);
    if (str.includes('k')) return Math.round(num * 1000);
    return parseInt(str, 10) || 0;
  };

  const baseLikes = parseLikesCount(item.stats?.likes);
  const displayLikes = liked ? (baseLikes + 1).toLocaleString() : item.stats?.likes || '1.2k';

  return (
    <div className="lightbox-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className={`lightbox-modal-container ${isFullscreen ? 'fullscreen-modal' : ''}`}>
        
        {/* Navigation Arrow Previous */}
        {hasPrev && (
          <button 
            className="lightbox-nav-arrow lightbox-prev" 
            onClick={handlePrev} 
            title="Previous creation (← Left Arrow)"
            aria-label="Previous creation"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}

        {/* Navigation Arrow Next */}
        {hasNext && (
          <button 
            className="lightbox-nav-arrow lightbox-next" 
            onClick={handleNext} 
            title="Next creation (→ Right Arrow)"
            aria-label="Next creation"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}

        {/* Main Window Card */}
        <div className="lightbox-card-window">
          
          {/* Top Browser Simulated Chrome Bar */}
          <div className="browser-chrome-bar">
            {/* Traffic Light Dots */}
            <div className="browser-traffic-lights">
              <button className="traffic-dot dot-close" onClick={onClose} title="Close (Esc)" aria-label="Close"></button>
              <button 
                className="traffic-dot dot-minimize" 
                onClick={() => setIsFullscreen(false)} 
                title="Normal view"
                aria-label="Restore"
              ></button>
              <button 
                className="traffic-dot dot-maximize" 
                onClick={() => setIsFullscreen(!isFullscreen)} 
                title="Toggle Fullscreen"
                aria-label="Toggle Fullscreen"
              ></button>
            </div>

            {/* View Mode Switcher: Live Interactive vs Screen */}
            <div className="browser-mode-switcher">
              <button 
                className={`mode-pill-btn ${previewMode === 'live' ? 'active' : ''}`}
                onClick={() => setPreviewMode('live')}
                title="Interactive live website preview"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <span>Live Site</span>
              </button>
              <button 
                className={`mode-pill-btn ${previewMode === 'screen' ? 'active' : ''}`}
                onClick={() => setPreviewMode('screen')}
                title="Pixel-crisp high resolution screenshot"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span>Screenshot</span>
              </button>
            </div>

            {/* Device Viewport Switcher */}
            <div className="browser-device-switcher">
              <button 
                className={`device-btn ${deviceMode === 'desktop' ? 'active' : ''}`}
                onClick={() => setDeviceMode('desktop')}
                title="Desktop View"
                aria-label="Desktop View"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </button>
              <button 
                className={`device-btn ${deviceMode === 'tablet' ? 'active' : ''}`}
                onClick={() => setDeviceMode('tablet')}
                title="Tablet View (768px)"
                aria-label="Tablet View"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                  <line x1="12" y1="18" x2="12.01" y2="18"></line>
                </svg>
              </button>
              <button 
                className={`device-btn ${deviceMode === 'mobile' ? 'active' : ''}`}
                onClick={() => setDeviceMode('mobile')}
                title="Mobile View (390px)"
                aria-label="Mobile View"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                  <line x1="12" y1="18" x2="12.01" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Address Bar Simulation */}
            <div className="browser-address-bar">
              <span className="address-lock-icon" title="Secure local exhibition">🔒</span>
              <span className="address-url-text">vibegallery.art/exhibition/{item.category}/{item.id}</span>
              {previewMode === 'live' && (
                <button 
                  className="address-action-btn" 
                  onClick={handleReloadIframe} 
                  title="Reload preview"
                  aria-label="Reload preview"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                </button>
              )}
              <button 
                className="address-action-btn" 
                onClick={handleCopyLink} 
                title={copied ? "Link Copied!" : "Copy URL"}
                aria-label="Copy URL"
              >
                {copied ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8CAE68" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
            </div>

            {/* Action Group: Open New Tab & Close */}
            <div className="browser-actions-group">
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="browser-open-tab-btn"
                title="Open in new browser tab"
              >
                <span>Open Full</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
              <button className="browser-close-btn" onClick={onClose} aria-label="Close preview modal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

          </div>

          {/* Modal Content Grid */}
          <div className="lightbox-content-grid">
            
            {/* Viewport Frame Container */}
            <div className="lightbox-viewport-area">
              <div className={`viewport-device-stage device-${deviceMode}`}>
                
                {previewMode === 'live' ? (
                  <div className="iframe-wrapper">
                    {isIframeLoading && (
                      <div className="iframe-loader-overlay">
                        <div className="loading-spinner"></div>
                        <span>Rendering {item.title}...</span>
                      </div>
                    )}
                    <iframe
                      ref={iframeRef}
                      key={iframeKey}
                      src={item.link}
                      title={item.title}
                      className="interactive-preview-iframe"
                      onLoad={() => setIsIframeLoading(false)}
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    />
                  </div>
                ) : (
                  <div className="screenshot-wrapper">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="screenshot-highres-img" 
                      loading="eager"
                    />
                    <div className="screenshot-badge-overlay">
                      <span className="screenshot-lens-icon">🔍</span>
                      <span>Verified High-Resolution Screen</span>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Sidebar Details Panel */}
            <aside className="lightbox-details-panel">
              
              {/* Header Badges & Count */}
              <div className="details-header-row">
                <div className="details-badge-group">
                  <span className="details-category-pill">{item.category}</span>
                  {item.language && (
                    <span className="details-lang-pill" title={meta.label}>
                      {meta.flag} {meta.label}
                    </span>
                  )}
                </div>
                {items.length > 0 && (
                  <span className="details-counter">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                  </span>
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="details-title-block">
                <div className="details-emoji-avatar">{item.emoji}</div>
                <div>
                  <h2 className="details-main-title">{item.title}</h2>
                  <p className="details-subtitle">{item.subtitle}</p>
                </div>
              </div>

              {/* Description */}
              <p className="details-description-text">{item.description}</p>

              {/* Feature Tags */}
              <div className="details-tags-container">
                <span className="details-tags-label">Keywords & Attributes:</span>
                <div className="details-tags-pills">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="details-tag-item">#{tag}</span>
                  ))}
                </div>
              </div>

              {/* Live Statistics & Engagement */}
              <div className="details-stats-card">
                <div className="stat-metric-box">
                  <span className="metric-icon">👁️</span>
                  <div className="metric-info">
                    <span className="metric-val">{item.stats?.views || '2.4k'}</span>
                    <span className="metric-label">Views</span>
                  </div>
                </div>

                <div 
                  className={`stat-metric-box metric-likeable ${liked ? 'liked' : ''}`}
                  onClick={() => setLiked(!liked)}
                  title="Click to like design"
                  role="button"
                  tabIndex={0}
                >
                  <span className="metric-icon">{liked ? '❤️' : '🤍'}</span>
                  <div className="metric-info">
                    <span className="metric-val">{displayLikes}</span>
                    <span className="metric-label">{liked ? 'Liked' : 'Likes'}</span>
                  </div>
                </div>

                <div 
                  className="stat-metric-box metric-shareable" 
                  onClick={handleCopyLink}
                  title="Share link"
                  role="button"
                  tabIndex={0}
                >
                  <span className="metric-icon">🔄</span>
                  <div className="metric-info">
                    <span className="metric-val">{item.stats?.shares || '180'}</span>
                    <span className="metric-label">{copied ? 'Copied!' : 'Shares'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="details-actions-footer">
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="details-primary-action-btn"
                >
                  <span>Launch Live Website</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
                
                <button 
                  className="details-secondary-action-btn" 
                  onClick={() => setPreviewMode(previewMode === 'live' ? 'screen' : 'live')}
                >
                  {previewMode === 'live' ? '📸 View Full Screenshot' : '🌐 Switch to Live Site'}
                </button>
              </div>

            </aside>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Lightbox;
