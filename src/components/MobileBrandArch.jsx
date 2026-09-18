import React from 'react';

export default function MobileBrandArch({ lang = 'en' }) {
  const isEn = lang === 'en';

  return (
    <header className="mobile-brand-arch">
      <div className="mobile-arch-backdrop" />
      <div className="mobile-logo-ring">
        <img
          src="/images/logo.jpg"
          alt="Retro Billiard Brand Emblem"
          className="mobile-logo-img"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
      <h2 className="mobile-title">RETRO BILLIARD</h2>
      <span className="mobile-subtitle">
        {isEn ? 'Staff & Terminal Sign In' : 'Masuk Staf & Terminal'}
      </span>
    </header>
  );
}
