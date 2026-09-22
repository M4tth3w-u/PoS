import React from 'react';

export default function HeroShowcase({ lang = 'en' }) {
  const content = {
    en: {
      orderDine: 'Order & Dine',
      brand: 'RETRO BILLIARD',
      portalTitle: 'Staff & Management Portal',
      headlinePre: 'Crafted with ',
      headlineMid: 'Soul',
      headlineAnd: ', Served with ',
      headlineEnd: 'Passion.',
      subtext: 'Official point of sale and back-office terminal for authorized personnel.',
    },
    id: {
      orderDine: 'Order & Dine',
      brand: 'RETRO BILLIARD',
      portalTitle: 'Portal Staf & Manajemen',
      headlinePre: 'Diracik dengan ',
      headlineMid: 'Hati',
      headlineAnd: ', Disajikan dengan ',
      headlineEnd: 'Dedikasi.',
      subtext: 'Terminal kasir dan administrasi resmi khusus staf dan manajemen berwenang.',
    },
  }[lang];

  return (
    <aside className="hero-panel" aria-label="Brand Showcase">
      <div className="hero-brand-block">
        <div className="hero-brand-top">
          <div className="hero-logo-ring">
            <img
              src="/images/logo.jpg"
              alt="Retro Billiard Brand Logo"
              className="hero-brand-logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div>
            <span className="hero-brand-badge">{content.orderDine}</span>
            <h1 className="hero-brand-title">{content.brand}</h1>
          </div>
        </div>
        <p className="hero-portal-subtitle">{content.portalTitle}</p>
      </div>

      {/* Unique Arched Portal Showcase (Inspired by Image 1's Arch + Image 3's Culinary Depth) */}
      <div className="hero-portal-stage">
        <div className="hero-arch-window">
          <div className="hero-arch-glow-border">
            <img
              src="/images/hero-food.jpg"
              alt="Artisanal food and diner spread"
              className="hero-arch-image"
            />
            <div className="hero-arch-gradient" />
          </div>
        </div>
      </div>

      <footer className="hero-footer">
        <h2 className="hero-punchline">
          {content.headlinePre}
          <span className="glow-cyan">{content.headlineMid}</span>
          {content.headlineAnd}
          <span className="glow-indigo">{content.headlineEnd}</span>
        </h2>
        <p className="hero-description">{content.subtext}</p>
      </footer>
    </aside>
  );
}
