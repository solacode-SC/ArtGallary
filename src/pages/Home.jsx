import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { galleryData } from '../data/galleryData';
import HeroCanvas from '../components/HeroCanvas';
import Lightbox from '../components/Lightbox';

function Home() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [lightboxItem, setLightboxItem] = useState(null);

  // Scroll handler for navbar background
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.editorial-card');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleFilterClick = (filter) => {
    navigate(`/gallery?filter=${filter}`);
  };

  const featuredItems = galleryData.slice(0, 8);

  return (
    <>
      {/* Ambient Background Orbs */}
      <div className="ambient-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="nav-content">
          <Link to="/" className="logo" id="logo">
            <img 
              src="assets/images/favicon.jpg" 
              alt="VibeGallery Logo" 
              style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(67, 52, 34, 0.08)' }} 
            />
            <span className="logo-text">VibeGallery</span>
          </Link>

          <div className="nav-center">
            <button className="nav-tab active" onClick={() => handleFilterClick('all')}>All Designs</button>
            <button className="nav-tab" onClick={() => handleFilterClick('dashboard')}>Dashboards</button>
            <button className="nav-tab" onClick={() => handleFilterClick('landing')}>Landing Pages</button>
            <button className="nav-tab" onClick={() => handleFilterClick('ecommerce')}>E-Commerce</button>
            <button className="nav-tab" onClick={() => handleFilterClick('app')}>Web Apps</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-premium" id="hero">
        <HeroCanvas />

        {/* Navbar Overlay */}
        <nav className="hero-nav">
          <Link to="/" className="logo">
            <img 
              src="assets/images/favicon.jpg" 
              alt="VibeGallery Logo" 
              style={{ width: '24px', height: '24px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255, 255, 255, 0.25)' }} 
            />
            <span className="logo-text">VibeGallery</span>
          </Link>
          
          <div className="nav-links-pill">
            <a href="#editorial-gallery-section" className="nav-link-item">Browse</a>
            <Link to="/gallery" className="nav-link-item">Catalog</Link>
            <a href="#footer" className="nav-link-item">About</a>
          </div>

          <Link to="/gallery" className="nav-cta-btn">Enter Museum</Link>
        </nav>

        {/* Bottom Content Grid */}
        <div className="hero-bottom-grid">
          <div className="hero-main-column">
            <h1 className="hero-main-title">Build web interfaces that inspire while you sleep</h1>
            <div className="hero-form-pill">
              <input type="email" placeholder="Enter your email" className="hero-form-input" />
              <button className="hero-form-submit">Get inspired</button>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Collection */}
      <section className="editorial-gallery-section" id="editorial-gallery-section">
        <div className="editorial-header">
          <span className="editorial-eyebrow">CURATED EXHIBITIONS</span>
          <h2 className="editorial-section-title">Featured Collection</h2>
          <p className="editorial-section-desc">Three signature interfaces selected for visual depth, minimal layout, and organic color integration.</p>
        </div>
        
        <div className="editorial-grid" id="editorial-grid">
          {featuredItems.map(item => {
            const labelTopLeft = item.category.toUpperCase();
            const labelTopRight = `👁️ ${item.stats.views.toUpperCase()}`;
            const labelBottomLeft = item.tags[0] ? item.tags[0].toUpperCase() : 'MINIMAL';
            const labelBottomRight = item.tags[1] ? item.tags[1].toUpperCase() : 'ELEGANCE';

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
              </article>
            );
          })}
        </div>

        <div className="editorial-see-all-wrapper">
          <Link to="/gallery" className="editorial-see-all-btn">
            <span>See All Collection</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </section>

      {/* Redesigned Premium Classical Engraving Footer */}
      <footer className="footer-premium" id="footer">
        <div className="footer-banner-container">
          <div className="footer-hero-style-bg"></div>
          <div className="footer-wave-divider">
            <svg className="footer-wave-svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,60 C180,100 320,40 500,75 C680,110 860,45 1040,85 C1220,125 1330,60 1440,95 L1440,120 L0,120 Z" fill="currentColor"/>
            </svg>
          </div>
        </div>

        <div className="footer-solid-block">
          <div className="footer-grid">
            <div className="footer-column-left">
              <h2 className="footer-logo">V I B E G A L L E R Y</h2>
              <div className="footer-subscribe-row">
                <input type="email" placeholder="ENTER EMAIL" className="footer-sub-input" />
                <button className="footer-sub-submit">SUBSCRIBE</button>
              </div>
              <div className="footer-copyright">
                <span className="copyright-text">VibeGallery</span>
                <span className="copyright-date">© All rights reserved 2026</span>
              </div>
            </div>

            <div className="footer-column-middle">
              <div className="footer-category-badge">Catalog</div>
              <ul className="footer-link-list">
                <li><Link to="/gallery?filter=dashboard">Dashboards</Link></li>
                <li><Link to="/gallery?filter=landing">Landing Pages</Link></li>
                <li><Link to="/gallery?filter=ecommerce">E-Commerce</Link></li>
                <li><Link to="/gallery?filter=app">Web Apps</Link></li>
                <li><Link to="/gallery">Full Catalog</Link></li>
              </ul>
            </div>

            <div className="footer-column-middle">
              <div className="footer-category-badge">Links</div>
              <ul className="footer-link-list">
                <li><a href="https://solaymantech.me" target="_blank" rel="noopener noreferrer">Portfolio</a></li>
                <li><a href="https://nashirtech.site" target="_blank" rel="noopener noreferrer">Blog</a></li>
              </ul>
            </div>

            <div className="footer-column-right">
              <div>
                <div className="footer-category-badge">Socials</div>
                <div className="footer-social-wrapper">
                  <div className="social-icons">
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><line x1="4" y1="20" x2="20" y2="4"></line></svg>
                    </a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                  </div>
                </div>
              </div>
              <p className="footer-location-tag" style={{ marginTop: '16px' }}>Curating worldwide from Tokyo & NYC</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  );
}

export default Home;
