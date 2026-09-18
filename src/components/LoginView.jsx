import React, { useState } from 'react';
import HeroShowcase from './HeroShowcase';
import MobileBrandArch from './MobileBrandArch';
import LoginForm from './LoginForm';
import './Login.css';

export default function LoginView({ onLogin }) {
  const [lang, setLang] = useState('en');

  const handleLoginSubmit = (credentials) => {
    // Pure front-end handler: when you connect your backend API, pass credentials to it
    if (onLogin) {
      onLogin(credentials);
    }
  };

  return (
    <div className="login-page-container">
      {/* Dynamic ambient lighting backdrop */}
      <div className="bg-ambient-layer" aria-hidden="true">
        <div className="ambient-blob-1" />
        <div className="ambient-blob-2" />
      </div>

      {/* Main Adaptive Shell */}
      <main className="login-shell">
        {/* Left Column: Desktop Hero Showcase (Unique Arched Vault) */}
        <HeroShowcase lang={lang} />

        {/* Right Column (or full card on mobile): Interactive Login Form */}
        <section className="form-column">
          {/* Top Brand Arch for Mobile / Tablet */}
          <MobileBrandArch lang={lang} />

          {/* Form and Controls */}
          <LoginForm
            lang={lang}
            setLang={setLang}
            onLoginSuccess={handleLoginSubmit}
          />
        </section>
      </main>
    </div>
  );
}
