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
import { apiUrl, API_BASE_URL } from '../config/api';

export default function LoginForm({ lang, setLang, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorPopup, setErrorPopup] = useState('');

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
      errInvalid: 'Invalid credentials. Please verify your ID and password.',
      errServer: 'Server error. Please try again later.',
      errNetwork: `Unable to connect to server (${API_BASE_URL}).`,
      popupTitle: 'Login Failed',
      popupClose: 'Dismiss',
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
      errInvalid: 'Kredensial tidak valid. Harap periksa ID dan kata sandi Anda.',
      errServer: 'Terjadi kesalahan server. Silakan coba lagi.',
      errNetwork: `Gagal terhubung ke server (${API_BASE_URL}).`,
      popupTitle: 'Login Gagal',
      popupClose: 'Tutup',
    },
  }[lang];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage(t.errEmpty);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(apiUrl('/auth/action_login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        // response may not be JSON (e.g. CI4 redirect/HTML response)
      }

      const resUrl = response.url || '';
      const isCiAdmin = resUrl.includes('/admin');
      const isCiCashier = resUrl.includes('/cashier');
      const isCiRejected = response.redirected && !isCiAdmin && !isCiCashier;

      const loginFailed = !response.ok || data?.success === false || isCiRejected;

      if (loginFailed) {
        const errorMsg =
          data?.message ||
          data?.error ||
          (response.status === 401 || isCiRejected ? t.errInvalid : t.errServer);
        setErrorMessage(errorMsg);
        setErrorPopup(errorMsg);
        return;
      }

      if (onLoginSuccess) {
        let role = data?.data?.id_role || (data?.id_role ? data.id_role : null);
        if (!role) {
          if (isCiAdmin) role = 1;
          else if (isCiCashier) role = 2;
        }

        const loginData = data?.data
          ? data
          : {
              data: {
                username: username.trim(),
                id_role: role || 1,
              },
            };
        onLoginSuccess(loginData);
      }
    } catch {
      setErrorMessage(t.errNetwork);
      setErrorPopup(t.errNetwork);
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Simple Error Popup Modal */}
      {errorPopup && (
        <div
          className="error-modal-backdrop"
          onClick={() => setErrorPopup('')}
          role="dialog"
          aria-modal="true"
          aria-labelledby="error-modal-title"
        >
          <div
            className="error-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="error-icon-badge">
              <AlertCircle size={28} />
            </div>
            <h3 id="error-modal-title" className="error-modal-title">
              {t.popupTitle}
            </h3>
            <p className="error-modal-msg">{errorPopup}</p>
            <button
              type="button"
              className="btn-modal-close"
              onClick={() => setErrorPopup('')}
              autoFocus
            >
              {t.popupClose}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
