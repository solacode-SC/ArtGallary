import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { galleryData } from '../data/galleryData';
import Lightbox from '../components/Lightbox';

const langMeta = {
    all: { label: 'All Languages', flag: '🌐' },
    en:  { label: 'English',       flag: '🇬🇧' },
    ar:  { label: 'Arabic',        flag: '🇸🇦' },
    zh:  { label: 'Chinese',       flag: '🇨🇳' },
    ja:  { label: 'Japanese',      flag: '🇯🇵' }
};

function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef(null);

  // Read URL params or default
  const currentFilter = searchParams.get('filter') || 'all';
  const currentLangFilter = searchParams.get('lang') || 'all';

  // Local state for UI toggles
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedLimit, setLoadedLimit] = useState(8);
  const [interactionMode, setInteractionMode] = useState('pagination');
  const [lightboxItem, setLightboxItem] = useState(null);

  const [categoriesActive, setCategoriesActive] = useState(true);
  const [languagesActive, setLanguagesActive] = useState(true);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const isMobile = window.innerWidth <= 1024;
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored === null) {
      return isMobile;
    }
    return stored === 'true';
  });

  // Sync sidebar collapse to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', sidebarCollapsed ? 'true' : 'false');
  }, [sidebarCollapsed]);

  // Keyboard shortcut "/" to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset pagination state when filters change
  const resetPagination = () => {
    setCurrentPage(1);
    setLoadedLimit(8);
    setInteractionMode('pagination');
  };

  // Change category filter
  const handleCategoryFilter = (filter) => {
    resetPagination();
    setSearchParams({ filter, lang: currentLangFilter });
  };

  // Change language filter
  const handleLanguageFilter = (lang) => {
    resetPagination();
    setSearchParams({ filter: currentFilter, lang });
  };

  // Filtering calculations
  const filtered = galleryData.filter(item => {
    const matchesCategory = currentFilter === 'all' || item.category === currentFilter;
    const matchesLang = currentLangFilter === 'all' || item.language === currentLangFilter;
    const cleanSearch = searchTerm.toLowerCase().trim();
    const matchesSearch = !cleanSearch ||
        item.title.toLowerCase().includes(cleanSearch) ||
        item.description.toLowerCase().includes(cleanSearch) ||
        item.tags.some(tag => tag.toLowerCase().includes(cleanSearch)) ||
        item.category.toLowerCase().includes(cleanSearch) ||
        item.language.toLowerCase().includes(cleanSearch);
    return matchesCategory && matchesLang && matchesSearch;
  });

  const cardsPerPage = 8;
  let itemsToRender = [];
  if (interactionMode === 'pagination') {
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    itemsToRender = filtered.slice(start, end);
  } else {
    itemsToRender = filtered.slice(0, loadedLimit);
  }

  // Intersection Observer for card fade-in
  useEffect(() => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.editorial-card');
    cards.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [itemsToRender]);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    setInteractionMode('pagination');
    document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
  };

  // Pagination elements builder
  const totalPages = Math.ceil(filtered.length / cardsPerPage);

  // Dynamic statistics
  const totalItemsCount = galleryData.length;
  const totalLangsCount = new Set(galleryData.filter(item => item.language).map(item => item.language)).size;

  return (
    <div className="gallery-page">
      {/* Ambient Background Orbs */}
      <div className="ambient-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Gallery Layout Container */}
      <div className={`app-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        
        {/* Sidebar Navigation */}
        <aside className="sidebar" id="sidebar">
          <div className="sidebar-workspace-header">
            <Link to="/" className="workspace-info" style={{ textDecoration: 'none', color: 'inherit' }}>
              <img 
                src="assets/images/favicon.jpg" 
                alt="VibeGallery Logo" 
                style={{ width: '18px', height: '18px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(67, 52, 34, 0.1)' }} 
              />
              <span className="workspace-name">VibeGallery Workspace</span>
              <svg className="workspace-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </Link>
            <button 
              className="sidebar-collapse-btn" 
              onClick={() => setSidebarCollapsed(true)}
              title="Collapse sidebar"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="11 17 6 12 11 7"></polyline>
                <polyline points="18 17 13 12 18 7"></polyline>
              </svg>
            </button>
          </div>

          {/* Quick Links */}
          <div className="sidebar-quick-links">
            <Link to="/" className="sidebar-item back-museum-btn">
              <span className="item-icon">🏛️</span>
              <span className="item-text">Back to Museum</span>
            </Link>
          </div>

          {/* Search */}
          <div className="sidebar-search-container">
            <div className="search-wrapper">
              <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                ref={searchInputRef}
                className="search-input" 
                placeholder="Search catalog..." 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  resetPagination();
                }}
              />
              <span className="search-shortcut">/</span>
            </div>
          </div>

          {/* Collapsible Sections */}
          <div className="sidebar-scrollable-content">
            
            {/* Categories */}
            <div className="sidebar-section" id="section-categories">
              <div 
                className={`sidebar-section-header ${categoriesActive ? 'active' : ''}`} 
                onClick={() => setCategoriesActive(!categoriesActive)}
              >
                <svg className="disclosure-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
                <span className="sidebar-label">Categories</span>
              </div>
              
              <div className={`sidebar-section-content ${categoriesActive ? 'active' : ''}`} id="content-categories">
                {[
                  { filter: 'all', icon: '📦', name: 'All Designs' },
                  { filter: 'dashboard', icon: '📊', name: 'Dashboards' },
                  { filter: 'landing', icon: '🎨', name: 'Landing Pages' },
                  { filter: 'ecommerce', icon: '🛍️', name: 'E-Commerce' },
                  { filter: 'app', icon: '💬', name: 'Web Apps' },
                  { filter: 'hero', icon: '🖼️', name: 'Hero Sections' },
                  { filter: 'about', icon: 'ℹ️', name: 'About Sections' },
                  { filter: 'footer', icon: '👣', name: 'Footer Sections' },
                  { filter: 'button', icon: '🔘', name: 'Buttons & Cards' },
                  { filter: 'sidebar', icon: '🎛️', name: 'Sidebar Modes' }
                ].map(cat => (
                  <button 
                    key={cat.filter}
                    className={`sidebar-item vertical-tab ${currentFilter === cat.filter ? 'active' : ''}`}
                    onClick={() => handleCategoryFilter(cat.filter)}
                  >
                    <span className="item-icon">{cat.icon}</span>
                    <span className="item-text">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="sidebar-section" id="section-languages">
              <div 
                className={`sidebar-section-header ${languagesActive ? 'active' : ''}`} 
                onClick={() => setLanguagesActive(!languagesActive)}
              >
                <svg className="disclosure-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
                <span className="sidebar-label">Languages</span>
              </div>
              
              <div className={`sidebar-section-content ${languagesActive ? 'active' : ''}`} id="content-languages">
                {[
                  { lang: 'all', icon: '🌐', label: 'All Languages' },
                  { lang: 'en', icon: '🇬🇧', label: 'English (EN)' },
                  { lang: 'ar', icon: '🇸🇦', label: 'Arabic (AR)' },
                  { lang: 'zh', icon: '🇨🇳', label: 'Chinese (ZH)' },
                  { lang: 'ja', icon: '🇯🇵', label: 'Japanese (JA)' }
                ].map(l => (
                  <button 
                    key={l.lang}
                    className={`sidebar-item lang-btn ${currentLangFilter === l.lang ? 'active' : ''}`}
                    onClick={() => handleLanguageFilter(l.lang)}
                    title={l.label}
                  >
                    <span className="item-icon">{l.icon}</span>
                    <span className="item-text">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats in Sidebar */}
          <div className="sidebar-stats">
            <div className="stats-header">
              <span className="stats-label">Museum Stats</span>
            </div>
            <div className="stats-grid">
              <div className="stat-pill">
                <span className="stat-count" id="sidebar-stat-items">{totalItemsCount}</span>
                <span className="stat-name">items</span>
              </div>
              <div className="stat-pill">
                <span className="stat-count" id="sidebar-stat-langs">{totalLangsCount}</span>
                <span className="stat-name">langs</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Sidebar Floating Expand Handle */}
        <button 
          className="sidebar-expand-btn" 
          onClick={() => setSidebarCollapsed(false)}
          title="Expand sidebar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="13 17 18 12 13 7"></polyline>
            <polyline points="6 17 11 12 6 7"></polyline>
          </svg>
        </button>

        {/* Sidebar Mobile Overlay Backdrop */}
        <div 
          className="sidebar-overlay" 
          id="sidebar-overlay"
          onClick={() => setSidebarCollapsed(true)}
        ></div>

        {/* Main Gallery Canvas */}
        <main className="main-content">
          <header className="content-header">
            <div className="header-left">
              <button 
                className="header-sidebar-toggle" 
                onClick={() => setSidebarCollapsed(false)}
                title="Show sidebar"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                </svg>
              </button>
              <div className="header-title-wrapper">
                <h1 className="page-title">Creations Catalog</h1>
                <p class="page-description">Browse and discover all design works within the museum.</p>
              </div>
            </div>
            
            <div className="header-right">
              <span className="result-count" id="result-count">
                {filtered.length === 0 ? 'No designs found' : `Showing ${filtered.length} design${filtered.length !== 1 ? 's' : ''}`}
              </span>
              <div className="view-toggles">
                <button 
                  className={`view-btn ${currentView === 'grid' ? 'active' : ''}`} 
                  onClick={() => setCurrentView('grid')}
                  aria-label="Grid view"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                  </svg>
                </button>
                <button 
                  className={`view-btn ${currentView === 'list' ? 'active' : ''}`} 
                  onClick={() => setCurrentView('list')}
                  aria-label="List view"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Card Grid */}
          {filtered.length > 0 ? (
            <div className={`gallery-grid ${currentView === 'list' ? 'list-view' : ''}`} id="gallery-grid">
              {itemsToRender.map(item => {
                const labelTopLeft = item.category.toUpperCase();
                const labelTopRight = `👁️ ${item.stats.views.toUpperCase()}`;
                const labelBottomLeft = item.tags[0] ? item.tags[0].toUpperCase() : 'MINIMAL';
                const labelBottomRight = item.tags[1] ? item.tags[1].toUpperCase() : 'DESIGN';

                const meta = langMeta[item.language] || langMeta.en;

                return (
                  <article 
                    key={item.id} 
                    className="editorial-card"
                    onClick={() => setLightboxItem(item)}
                  >
                    <div className="editorial-card-header">
                      <span className="editorial-label-mini">{labelTopLeft}</span>
                      <span className="editorial-label-mini">{labelTopRight}</span>
                    </div>
                    
                    <h3 className="editorial-card-title">{item.title}</h3>
                    
                    <div className="editorial-image-container">
                      <img src={item.image} alt={item.title} className="editorial-card-image" loading="lazy" />
                      <div className="editorial-emblem">{item.emoji}</div>
                    </div>
                    
                    <div className="editorial-brand-mark">VIBEGALLERY</div>
                    
                    <div className="editorial-card-footer">
                      <span className="editorial-label-mini">{labelBottomLeft}</span>
                      <div className="editorial-footer-right">
                        <span className="card-lang-badge" title={meta.label}>{meta.flag}</span>
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="editorial-link-mini"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {labelBottomRight} ›
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="empty-state" id="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
                <path d="M8 11h6"/>
              </svg>
              <h3>No creations found</h3>
              <p>Try clearing filters or search terms.</p>
            </div>
          )}

          {/* Load More & Pagination Controls */}
          {filtered.length > 0 && (
            <div className="gallery-controls-container">
              {/* Load More Button */}
              {itemsToRender.length < filtered.length && (
                <button 
                  className="load-more-btn" 
                  id="load-more-btn"
                  onClick={() => {
                    setInteractionMode('loadMore');
                    setLoadedLimit(prev => prev + cardsPerPage);
                  }}
                >
                  Load More ({filtered.length - itemsToRender.length} left)
                </button>
              )}

              {/* Pagination indicators */}
              {interactionMode === 'pagination' && totalPages > 1 && (
                <div className="pagination-container" id="pagination-container" style={{ display: 'flex' }}>
                  {/* Prev Button */}
                  <button 
                    className="pagination-btn pagination-arrow"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    ‹
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(num => (
                    <button 
                      key={num}
                      className={`pagination-btn ${currentPage === num ? 'active' : ''}`}
                      onClick={() => handlePageChange(num)}
                    >
                      {num}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button 
                    className="pagination-btn pagination-arrow"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Lightbox Modal */}
      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </div>
  );
}

export default Gallery;
