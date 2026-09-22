import React, { useState } from 'react';
import LoginForm from './LoginForm';
import './Login.css';

export default function LoginView({ onLogin }) {
  const [lang, setLang] = useState('en');

  const handleLoginSubmit = (credentials) => {
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

      {/* Main Centered Shell */}
      <main className="login-shell">
        <LoginForm
          lang={lang}
          setLang={setLang}
          onLoginSuccess={handleLoginSubmit}
        />
      </main>
    </div>
  );
}
