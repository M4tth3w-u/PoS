import React from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab, user, onLogout }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'food', label: 'Food & Stock', icon: UtensilsCrossed },
    { id: 'accounts', label: 'Accounts', icon: Users },
  ];

  return (
    <aside className="admin-sidebar" aria-label="Admin Navigation Sidebar">
      <div>
        {/* Brand Crest */}
        <div className="sidebar-header">
          <div className="brand-ball-badge">
            <div className="brand-ball-inner">8</div>
          </div>
          <div className="brand-text-wrap">
            <span className="brand-title">Cue & Dine</span>
            <span className="brand-subtitle">Admin Console</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Admin Profile & Logout */}
      <div className="sidebar-footer">
        <div className="admin-profile-card">
          <div className="admin-avatar">
            {user?.username?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="admin-info">
            <span className="admin-name">{user?.username || 'Administrator'}</span>
            <span className="admin-role-badge">Super Admin</span>
          </div>
        </div>

        <button
          type="button"
          className="btn-sidebar-logout"
          onClick={onLogout}
          title="Sign out of Admin Portal"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
