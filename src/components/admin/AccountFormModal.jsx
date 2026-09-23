import React, { useState } from 'react';
import { X, UserPlus, Shield } from 'lucide-react';

export default function AccountFormModal({ initialData, onClose, onSave }) {
  const isEditing = Boolean(initialData?.id);

  const [username, setUsername] = useState(initialData?.username || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialData?.id_role ? String(initialData.id_role) : '2'); // 1 = Admin, 2 = Cashier
  const [status, setStatus] = useState(initialData?.status || 'Active');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    onSave({
      ...(isEditing ? { id: initialData.id } : {}),
      username: username.trim(),
      password,
      id_role: Number(role),
      roleName: Number(role) === 1 ? 'Admin' : 'Cashier',
      status,
      lastActive: isEditing ? (initialData.lastActive || 'Today') : 'Just now',
    });
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserPlus size={22} color="var(--primary)" />
            <h2 className="modal-title">
              {isEditing ? 'Edit Staff Account' : 'Create Staff Account'}
            </h2>
          </div>
          <button type="button" className="btn-modal-close-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="modal-form-group">
            <label className="modal-label">User ID / Username</label>
            <input
              type="text"
              className="modal-input"
              placeholder="e.g. cashier_budi"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="modal-form-group">
            <label className="modal-label">
              {isEditing ? 'Password (leave blank to keep current)' : 'Password'}
            </label>
            <input
              type="password"
              className="modal-input"
              placeholder={isEditing ? '••••••••' : 'Enter login password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!isEditing}
            />
          </div>

          {/* Role & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="modal-form-group">
              <label className="modal-label">System Role</label>
              <select
                className="modal-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="2">Cashier / Staff (Role 2)</option>
                <option value="1">Administrator (Role 1)</option>
              </select>
            </div>

            <div className="modal-form-group">
              <label className="modal-label">Account Status</label>
              <select
                className="modal-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="modal-footer-btns">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-modal-submit">
              {isEditing ? 'Update Account' : 'Save Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
