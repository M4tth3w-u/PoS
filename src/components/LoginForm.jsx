import React, { useState } from 'react';
import {
  AtSign,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Loader2,
  Globe,
} from 'lucide-react';

export default function LoginForm({ lang, setLang, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Active Focus tracking for smooth micro-animations
  const [userFocused, setUserFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const t = {
    en: {
      title: 'Portal Sign In',
      subtitle: 'Enter your credentials to access the terminal.',
      userLabel: 'Staff ID or Username',
      userPlaceholder: 'Enter your ID or username...',
      passLabel: 'Password',
      passPlaceholder: '••••••••',
      btnSubmit: 'Open POS Terminal',
      btnSubmitting: 'Authenticating...',
      errEmpty: 'Please enter both your ID and password.',
    },
    id: {
      title: 'Masuk Portal',
      subtitle: 'Masukkan akun Anda untuk membuka terminal.',
      userLabel: 'ID Staf atau Username',
      userPlaceholder: 'Masukkan ID atau username...',
      passLabel: 'Kata Sandi',
      passPlaceholder: '••••••••',
      btnSubmit: 'Buka Terminal POS',
      btnSubmitting: 'Memverifikasi...',
      errEmpty: 'Harap masukkan ID dan kata sandi.',
    },
  }[lang];

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage(t.errEmpty);
      return;
    }

    setIsSubmitting(true);

    if (onLoginSuccess) {
      onLoginSuccess({
        username: username.trim(),
        password: password,
      });
    }

    setTimeout(() => {
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="form-panel">
      {/* Form Top Navigation Bar */}
      <header className="form-header">
        <div className="form-title-row">
          <div>
            <h2 className="form-title">{t.title}</h2>
            <p className="form-subtitle">{t.subtitle}</p>
          </div>
          <button
            type="button"
            className="lang-switcher-btn"
            onClick={() => setLang(lang === 'en' ? 'id' : 'en')}
            title="Switch Language / Ganti Bahasa"
            aria-label="Switch Language"
          >
            <Globe size={14} />
            <span>{lang.toUpperCase()}</span>
          </button>
        </div>
      </header>

      {/* Alert Banner for Errors (#F87171 with Shake animation) */}
      {errorMessage && (
        <div className="alert-banner" role="alert">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} noValidate>
        {/* Username / Staff ID Input */}
        <div className="form-group">
          <label htmlFor="input-username" className="form-label">
            {t.userLabel}
          </label>
          <div
            className={`input-control ${userFocused ? 'is-focused' : ''} ${
              errorMessage ? 'has-error' : ''
            }`}
          >
            <span className="input-icon">
              <AtSign size={18} />
            </span>
            <input
              id="input-username"
              type="text"
              className="text-input"
              value={username}
              placeholder={t.userPlaceholder}
              autoComplete="username"
              onChange={(e) => {
                setUsername(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              onFocus={() => setUserFocused(true)}
              onBlur={() => setUserFocused(false)}
            />
          </div>
        </div>

        {/* Password Input with Lock & Eye Toggle */}
        <div className="form-group">
          <label htmlFor="input-password" className="form-label">
            {t.passLabel}
          </label>
          <div
            className={`input-control ${passFocused ? 'is-focused' : ''} ${
              errorMessage ? 'has-error' : ''
            }`}
          >
            <span className="input-icon">
              <Lock size={18} />
            </span>
            <input
              id="input-password"
              type={showPassword ? 'text' : 'password'}
              className="text-input"
              value={password}
              placeholder={t.passPlaceholder}
              autoComplete="current-password"
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              onFocus={() => setPassFocused(true)}
              onBlur={() => setPassFocused(false)}
            />
            <button
              type="button"
              className="toggle-pw-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="submit"
          className="btn-submit"
          disabled={isSubmitting}
          id="btn-login-submit"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="spinner" />
              <span>{t.btnSubmitting}</span>
            </>
          ) : (
            <>
              <span>{t.btnSubmit}</span>
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
