import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Edit3,
  Trash2,
  Shield,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';

export default function AccountManagementTab({
  accounts,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteAccount,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch = acc.username
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === 'All' ||
      (roleFilter === 'Admin' && Number(acc.id_role) === 1) ||
      (roleFilter === 'Cashier' && Number(acc.id_role) === 2);

    return matchesSearch && matchesRole;
  });

  return (
    <div className="account-management-tab">
      {/* Top Toolbar */}
      <div className="toolbar-container">
        <div className="toolbar-search-wrap">
          <div className="search-input-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search user accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Admin">Administrators (Role 1)</option>
            <option value="Cashier">Cashiers (Role 2)</option>
          </select>
        </div>

        <button
          type="button"
          className="btn-primary-action"
          onClick={onOpenAddModal}
        >
          <UserPlus size={18} />
          <span>Create Staff Account</span>
        </button>
      </div>

      {/* Desktop & Tablet Table */}
      <div className="table-panel">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Account User</th>
              <th>System Role</th>
              <th>Status</th>
              <th>Last Active</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                  No accounts found matching your query.
                </td>
              </tr>
            ) : (
              filteredAccounts.map((account) => {
                const isAdmin = Number(account.id_role) === 1;
                return (
                  <tr key={account.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-table-avatar">
                          {account.username.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600 }}>{account.username}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`role-tag ${isAdmin ? 'admin' : 'cashier'}`}>
                        {isAdmin ? <Shield size={12} /> : <UserCheck size={12} />}
                        {isAdmin ? 'Admin' : 'Cashier'}
                      </span>
                    </td>
                    <td>
                      <div className="status-badge">
                        <span
                          className={`status-dot ${
                            account.status === 'Active' ? 'active' : 'inactive'
                          }`}
                        />
                        <span>{account.status || 'Active'}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {account.lastActive || 'Today'}
                    </td>
                    <td>
                      <div className="table-action-btns" style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="btn-table-action"
                          onClick={() => onOpenEditModal(account)}
                          title="Edit user details"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-table-action delete"
                          onClick={() => onDeleteAccount(account.id)}
                          title="Delete user"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Profile Cards (< 768px) */}
      <div className="mobile-accounts-list">
        {filteredAccounts.map((account) => {
          const isAdmin = Number(account.id_role) === 1;
          return (
            <div key={account.id} className="mobile-account-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="user-table-avatar">
                  {account.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                    {account.username}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`role-tag ${isAdmin ? 'admin' : 'cashier'}`}>
                      {isAdmin ? 'Admin' : 'Cashier'}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {account.status}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className="btn-table-action"
                  onClick={() => onOpenEditModal(account)}
                >
                  <Edit3 size={16} />
                </button>
                <button
                  type="button"
                  className="btn-table-action delete"
                  onClick={() => onDeleteAccount(account.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
