import React, { useState } from 'react';
import { X, CircleDot } from 'lucide-react';

export default function TableFormModal({ initialData, onClose, onSave }) {
  const isEditing = Boolean(initialData?.id);

  const [tableNumber, setTableNumber] = useState(initialData?.tableNumber || '');
  const [type, setType] = useState(initialData?.type || 'Standard (9ft)');
  const [hourlyRate, setHourlyRate] = useState(initialData?.hourlyRate ?? 35000);
  const [status, setStatus] = useState(
    initialData?.status === 'Maintenance' ? 'Maintenance' : 'Ready'
  );
  const [location, setLocation] = useState(initialData?.location || 'Main Floor - Area A');
  const [specifications, setSpecifications] = useState(
    initialData?.specifications || 'Tournament Slate & Standard Cloth'
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tableNumber.trim()) return;

    onSave({
      id: initialData?.id || `tbl-${Date.now()}`,
      tableNumber: tableNumber.trim(),
      type,
      hourlyRate: Number(hourlyRate) || 0,
      status,
      location: location.trim() || 'Main Floor',
      specifications: specifications.trim() || 'Standard Billiard Table',
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CircleDot size={22} color="var(--primary)" />
            <h2 className="modal-title">
              {isEditing ? 'Edit Billiard Table' : 'Add New Billiard Table'}
            </h2>
          </div>
          <button
            type="button"
            className="btn-modal-close-icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Table Number / Identifier */}
          <div className="modal-form-group">
            <label className="modal-label">Table Number / Identifier</label>
            <input
              type="text"
              className="modal-input"
              placeholder="e.g. Table 01, VIP Room 1"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Type / Tier & Hourly Rate */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="modal-form-group">
              <label className="modal-label">Tier / Category</label>
              <select
                className="modal-input"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Standard (9ft)">Standard (9ft)</option>
                <option value="VIP Room">VIP Room</option>
                <option value="VVIP Suite">VVIP Suite</option>
              </select>
            </div>

            <div className="modal-form-group">
              <label className="modal-label">Hourly Rate (IDR)</label>
              <input
                type="number"
                min="0"
                step="1000"
                className="modal-input"
                placeholder="e.g. 35000"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Status & Floor Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="modal-form-group">
              <label className="modal-label">Operational Status</label>
              <select
                className="modal-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Ready">Ready / Available</option>
                <option value="Maintenance">Under Maintenance</option>
              </select>
            </div>

            <div className="modal-form-group">
              <label className="modal-label">Floor Location</label>
              <input
                type="text"
                className="modal-input"
                placeholder="e.g. Main Hall - Area A"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Equipment / Specs Notes */}
          <div className="modal-form-group">
            <label className="modal-label">Cloth / Equipment Specs</label>
            <input
              type="text"
              className="modal-input"
              placeholder="e.g. Simonis 860 Cloth, Aramith Tournament Balls"
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
            />
          </div>

          <div className="modal-footer-btns">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-modal-submit">
              {isEditing ? 'Save Table Changes' : 'Create Table'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
