import React, { useEffect, useState } from 'react';
import LoginView from './components/LoginView';
import AdminView from './components/AdminView';
import CashierView from './components/CashierView';

const LOGIN_STORAGE_KEY = 'pos_login_response';

function App() {
  const [loginResponse, setLoginResponse] = useState(() => {
    try {
      const savedLogin = localStorage.getItem(LOGIN_STORAGE_KEY);
      return savedLogin ? JSON.parse(savedLogin) : null;
    } catch {
      localStorage.removeItem(LOGIN_STORAGE_KEY);
      return null;
    }
  });

  useEffect(() => {
    if (loginResponse) {
      localStorage.setItem(LOGIN_STORAGE_KEY, JSON.stringify(loginResponse));
    } else {
      localStorage.removeItem(LOGIN_STORAGE_KEY);
    }
  }, [loginResponse]);

  const handleLogout = () => {
    setLoginResponse(null);
  };

  if (loginResponse?.data?.id_role === 1 || loginResponse?.data?.id_role === '1') {
    return <AdminView user={loginResponse.data} onLogout={handleLogout} />;
  }

  if (loginResponse?.data?.id_role === 2 || loginResponse?.data?.id_role === '2') {
    return <CashierView user={loginResponse.data} onLogout={handleLogout} />;
  }

  return <LoginView onLogin={setLoginResponse} />;
}

export default App;
