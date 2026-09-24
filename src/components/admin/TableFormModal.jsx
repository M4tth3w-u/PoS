import React, { useState } from 'react';
import { X, CircleDot } from 'lucide-react';

export default function TableFormModal({
  initialData,
  categories,
  statuses,
  onClose,
  onSave,
}) {
  const isEditing = Boolean(initialData?.id);

  const [tableNumber, setTableNumber] = useState(initialData?.tableNumber || '');
  const categoryOptions = categories.length > 0
    ? categories
    : [{ value: '', label: 'Category belum tersedia' }];
  const statusOptions = statuses.length > 0
    ? statuses
    : [{ value: '', label: 'Status belum tersedia' }];
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId ?? categoryOptions[0].value
  );
  const [hourlyRate, setHourlyRate] = useState(initialData?.hourlyRate ?? 35000);
  const [statusId, setStatusId] = useState(
    initialData?.statusId ?? statusOptions[0].value
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tableNumber.trim()) return;

    onSave({
      ...(isEditing ? { id: initialData.id } : {}),
      tableNumber: tableNumber.trim(),
      categoryId,
      hourlyRate: Number(hourlyRate) || 0,
      statusId,
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
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categoryOptions.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
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

          {/* Operational Status */}
          <div className="modal-form-group">
            <label className="modal-label">Operational Status</label>
            <select
              className="modal-input"
              value={statusId}
              onChange={(e) => setStatusId(e.target.value)}
            >
              {statusOptions.map((statusOption) => (
                <option key={statusOption.value} value={statusOption.value}>
                  {statusOption.label}
                </option>
              ))}
            </select>
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
