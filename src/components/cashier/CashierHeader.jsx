import React, { useState, useEffect } from 'react';
import { Settings, LogOut, Clock, Wifi } from 'lucide-react';

export default function CashierHeader({ user, onLogout }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="cashier-header">
      <div className="cashier-header-brand">
        <div className="brand-ball-badge" style={{ width: '40px', height: '40px' }}>
          <div className="brand-ball-inner" style={{ width: '18px', height: '18px', fontSize: '10px' }}>
            8
          </div>
        </div>
        <div className="brand-text-wrap">
          <span className="brand-title">Cue &amp; Dine</span>
          <span className="brand-subtitle">Cashier Terminal</span>
        </div>
      </div>

      <div className="cashier-header-user">
        <div className="cashier-clock-badge">
          <Clock size={12} style={{ display: 'inline', marginRight: '5px' }} />
          <span>{timeStr}</span>
        </div>

        <span className="cashier-greeting">
          <span className="cashier-user-avatar">
            {(user?.username || 'K').charAt(0).toUpperCase()}
          </span>
          <span>Halo, Kasir <strong>{user?.username || 'Sarah'}</strong>!</span>
        </span>

        <button
          type="button"
          className="btn-cashier-header-action"
          onClick={onLogout}
          title="Logout"
          aria-label="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
