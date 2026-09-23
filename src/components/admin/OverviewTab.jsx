import React from 'react';
import {
  Boxes,
  AlertTriangle,
  Users,
  CheckCircle2,
  PackagePlus,
  TrendingUp,
  Shield,
  Clock,
  ChevronRight,
} from 'lucide-react';

export default function OverviewTab({
  foods,
  accounts,
  onOpenResupply,
  onNavigateTab,
}) {
  const lowStockItems = foods.filter((f) => f.stock <= 5);
  const outOfStockItems = foods.filter((f) => f.stock === 0);

  return (
    <div className="overview-tab-content">
      {/* 3 Executive KPI Cards */}
      <div className="overview-grid">
        {/* Total Menu Dishes */}
        <div
          className="kpi-card"
          onClick={() => onNavigateTab('food')}
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
        >
          <div className="kpi-top-row">
            <div className="kpi-icon-badge cyan">
              <Boxes size={22} />
            </div>
            <span className="kpi-trend-pill positive">
              <TrendingUp size={12} /> Live Menu
            </span>
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Active Menu Items</span>
            <span className="kpi-value">{foods.length} Dishes</span>
            <div className="kpi-bar-track">
              <div
                className="kpi-bar-fill"
                style={{
                  width: `${Math.min(100, foods.length * 10)}%`,
                  background: 'var(--primary)',
                }}
              />
            </div>
            <span className="kpi-subtext">Across kitchen & beverage catalog</span>
          </div>
        </div>

        {/* Low Stock Radar */}
        <div
          className="kpi-card"
          onClick={() => onNavigateTab('food')}
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
        >
          <div className="kpi-top-row">
            <div className="kpi-icon-badge rose">
              <AlertTriangle size={22} />
            </div>
            <span
              className={`kpi-trend-pill ${
                lowStockItems.length > 0 ? 'negative' : 'positive'
              }`}
            >
              {lowStockItems.length > 0 ? 'Restock Needed' : 'Good Reserve'}
            </span>
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Low Stock Alerts</span>
            <span
              className="kpi-value"
              style={{
                color: lowStockItems.length > 0 ? 'var(--alert)' : '#ffffff',
              }}
            >
              {lowStockItems.length} Items
            </span>
            <div className="kpi-bar-track">
              <div
                className="kpi-bar-fill"
                style={{
                  width: `${Math.min(
                    100,
                    (lowStockItems.length / Math.max(1, foods.length)) * 100
                  )}%`,
                  background: 'var(--alert)',
                }}
              />
            </div>
            <span className="kpi-subtext">
              {outOfStockItems.length > 0
                ? `${outOfStockItems.length} items currently out of stock`
                : 'Inventory items with ≤ 5 units'}
            </span>
          </div>
        </div>

        {/* Staff & Admin Accounts */}
        <div
          className="kpi-card"
          onClick={() => onNavigateTab('accounts')}
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
        >
          <div className="kpi-top-row">
            <div className="kpi-icon-badge indigo">
              <Users size={22} />
            </div>
            <span className="kpi-trend-pill neutral">Staff Portal</span>
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Staff & Cashier Roster</span>
            <span className="kpi-value">{accounts.length} Accounts</span>
            {/* Overlapping avatar preview */}
            {accounts.length > 0 ? (
              <div className="staff-avatar-stack">
                {accounts.slice(0, 4).map((acc) => (
                  <div
                    key={acc.id}
                    className="mini-stack-avatar"
                    title={acc.username}
                  >
                    {acc.username.charAt(0).toUpperCase()}
                  </div>
                ))}
                {accounts.length > 4 && (
                  <div className="mini-stack-avatar more">
                    +{accounts.length - 4}
                  </div>
                )}
              </div>
            ) : (
              <div className="kpi-bar-track">
                <div
                  className="kpi-bar-fill"
                  style={{ width: '0%', background: 'var(--accent)' }}
                />
              </div>
            )}
            <span className="kpi-subtext">Cashiers & Administrators</span>
          </div>
        </div>
      </div>

      {/* Dual Operational Hub: Left Priority Restock Radar | Right Registered Staff Access */}
      <div className="overview-dual-grid">
        {/* Left Column: Priority Restock Attention Radar */}
        <div className="overview-panel-card">
          <div className="panel-header-row">
            <div className="panel-header-title">
              <AlertTriangle size={18} color="var(--alert)" />
              <h3>Priority Restock Radar</h3>
            </div>
            <button
              type="button"
              className="btn-panel-link"
              onClick={() => onNavigateTab('food')}
            >
              <span>Manage All ({foods.length})</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="empty-radar-box">
              <div className="empty-radar-icon">
                <CheckCircle2 size={36} color="var(--success)" />
              </div>
              <h4>All Inventory Is Healthy</h4>
              <p>No food or drink items currently fall below threshold reserve levels.</p>
            </div>
          ) : (
            <div className="restock-radar-list">
              {lowStockItems.map((item) => {
                const stockPercent = Math.min(
                  100,
                  Math.round((item.stock / 20) * 100)
                );
                const isZero = item.stock === 0;

                return (
                  <div key={item.id} className="restock-radar-card">
                    <div className="radar-card-left">
                      <div className="radar-dish-thumb">
                        <img
                          src={item.image || '/images/hero-food.jpg'}
                          alt={item.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/hero-food.jpg';
                          }}
                        />
                      </div>

                      <div className="radar-dish-info">
                        <div className="radar-title-group">
                          <h4 className="radar-dish-name">{item.name}</h4>
                          <span className="radar-category-tag">
                            {item.category}
                          </span>
                        </div>

                        {/* Visual Remaining Bar */}
                        <div className="radar-stock-meter-wrap">
                          <div className="radar-stock-meter-track">
                            <div
                              className={`radar-stock-meter-bar ${
                                isZero ? 'danger' : 'warn'
                              }`}
                              style={{ width: `${Math.max(8, stockPercent)}%` }}
                            />
                          </div>
                          <span className="radar-stock-text">
                            {isZero ? (
                              <strong style={{ color: 'var(--alert)' }}>
                                0 Units (Out of Stock)
                              </strong>
                            ) : (
                              <span>{item.stock} / 20 units remaining</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="radar-card-right">
                      <button
                        type="button"
                        className="btn-radar-resupply"
                        onClick={() => onOpenResupply(item)}
                        title={`Add stock to ${item.name}`}
                      >
                        <PackagePlus size={14} />
                        <span>+ Resupply</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Registered Staff Access */}
        <div className="overview-panel-card">
          <div className="panel-header-row">
            <div className="panel-header-title">
              <Users size={18} color="var(--accent)" />
              <h3>Registered Staff Access</h3>
            </div>
            <button
              type="button"
              className="btn-panel-link"
              onClick={() => onNavigateTab('accounts')}
            >
              <span>Manage Roster</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {accounts.length === 0 ? (
            <div className="empty-radar-box">
              <div className="empty-radar-icon">
                <Users size={32} color="var(--accent)" />
              </div>
              <h4>No Accounts Found</h4>
              <p>Staff and cashier accounts will appear here once connected to the backend database.</p>
            </div>
          ) : (
            <div className="overview-staff-list">
              {accounts.map((acc) => {
                const isAdmin = Number(acc.id_role) === 1;
                return (
                  <div key={acc.id} className="overview-staff-row">
                    <div className="staff-avatar-badge">
                      {acc.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="staff-meta">
                      <span className="staff-name">{acc.username}</span>
                      <span className="staff-activity">
                        <Clock
                          size={11}
                          style={{ display: 'inline', marginRight: '4px' }}
                        />
                        {acc.lastActive || 'Active today'}
                      </span>
                    </div>
                    <span className={`role-tag ${isAdmin ? 'admin' : 'cashier'}`}>
                      {isAdmin ? <Shield size={11} /> : null}
                      {isAdmin ? 'Admin' : 'Cashier'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
