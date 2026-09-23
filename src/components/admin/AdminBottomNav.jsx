import React from 'react';
import { LayoutDashboard, CircleDot, UtensilsCrossed, Users, LogOut } from 'lucide-react';

export default function AdminBottomNav({ activeTab, setActiveTab, onLogout }) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'tables', label: 'Tables', icon: CircleDot },
    { id: 'food', label: 'Food', icon: UtensilsCrossed },
    { id: 'accounts', label: 'Accounts', icon: Users },
  ];

  return (
    <nav className="admin-bottom-nav" aria-label="Mobile Navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon size={22} />
            <span>{tab.label}</span>
          </button>
        );
      })}

      <button
        type="button"
        className="bottom-nav-item"
        onClick={onLogout}
        title="Sign Out"
      >
        <LogOut size={22} />
        <span>Logout</span>
      </button>
    </nav>
  );
}
