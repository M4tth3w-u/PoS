import React, { useEffect, useState } from 'react';
import { Circle, RefreshCw } from 'lucide-react';
import { apiUrl, API_BASE_URL } from '../config/api';

const STATUS_CHECK_INTERVAL = 10000;

export default function BackendStatusIndicator({ compact = false }) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let isMounted = true;

    const checkStatus = async () => {
      try {
        const response = await fetch(apiUrl('/status'), {
          method: 'GET',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });

        if (isMounted) setStatus(response.ok ? 'connected' : 'disconnected');
      } catch {
        if (isMounted) setStatus('disconnected');
      }
    };

    checkStatus();
    const intervalId = window.setInterval(checkStatus, STATUS_CHECK_INTERVAL);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const statusText = {
    checking: 'Checking connection',
    connected: 'Connected to Server',
    disconnected: 'Disconnected from Server',
  }[status];

  return (
    <div
      className={`backend-status-indicator ${compact ? 'compact' : ''} ${status}`}
      title={`${statusText}: ${API_BASE_URL}/status`}
      role="status"
      aria-live="polite"
    >
      {status === 'checking' ? <RefreshCw className="backend-status-icon spinning" size={14} /> : <Circle className="backend-status-icon" size={10} fill="currentColor" />}
      {!compact && <span>{statusText}</span>}
    </div>
  );
}
