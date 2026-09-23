import React, { useState } from 'react';
import LoginView from './components/LoginView';
import AdminView from './components/AdminView';
import CashierView from './components/CashierView';

function App() {
  const [loginResponse, setLoginResponse] = useState(null);

  if (loginResponse?.data?.id_role === 1 || loginResponse?.data?.id_role === '1') {
    return <AdminView user={loginResponse.data} />;
  }

  if (loginResponse?.data?.id_role === 2 || loginResponse?.data?.id_role === '2') {
    return <CashierView user={loginResponse.data} />;
  }

  return <LoginView onLogin={setLoginResponse} />;
}

export default App;
