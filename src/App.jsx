import React, { useEffect, useState } from 'react';
import LoginView from './components/LoginView';
import AdminView from './components/AdminView';
import CashierView from './components/CashierView';
import { apiUrl } from './config/api';

const LOGIN_STORAGE_KEY = 'pos_login_response';

function App() {
  const [loginResponse, setLoginResponse] = useState(() => {
    try {
      localStorage.removeItem(LOGIN_STORAGE_KEY);
      const savedLogin = sessionStorage.getItem(LOGIN_STORAGE_KEY);
      return savedLogin ? JSON.parse(savedLogin) : null;
    } catch {
      sessionStorage.removeItem(LOGIN_STORAGE_KEY);
      return null;
    }
  });
  const isAdmin = loginResponse?.data?.id_role === 1 || loginResponse?.data?.id_role === '1';
  const [isCheckingSession, setIsCheckingSession] = useState(isAdmin);

  useEffect(() => {
    if (!isAdmin) return;

    let cancelled = false;

    const validateSession = async () => {
      try {
        const response = await fetch(apiUrl('/admin/user'), {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });

        const isLoginRedirect = response.url.includes('/auth/') || response.url.includes('/login');

        if (!cancelled && (response.status === 401 || response.status === 403 || isLoginRedirect)) {
          setLoginResponse(null);
        }
      } catch {
        // Keep the local session when the backend is temporarily unreachable.
      } finally {
        if (!cancelled) setIsCheckingSession(false);
      }
    };

    validateSession();

    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  useEffect(() => {
    if (loginResponse) {
      sessionStorage.setItem(LOGIN_STORAGE_KEY, JSON.stringify(loginResponse));
    } else {
      sessionStorage.removeItem(LOGIN_STORAGE_KEY);
    }
  }, [loginResponse]);

  const handleLogout = () => {
    sessionStorage.removeItem(LOGIN_STORAGE_KEY);
    localStorage.removeItem(LOGIN_STORAGE_KEY);
    setLoginResponse(null);
  };

  if (isCheckingSession) return null;

  if (loginResponse?.data?.id_role === 1 || loginResponse?.data?.id_role === '1') {
    return <AdminView user={loginResponse.data} onLogout={handleLogout} />;
  }

  if (loginResponse?.data?.id_role === 2 || loginResponse?.data?.id_role === '2') {
    return <CashierView user={loginResponse.data} onLogout={handleLogout} />;
  }

  return <LoginView onLogin={setLoginResponse} />;
}

export default App;
