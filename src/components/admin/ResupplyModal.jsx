import React, { useState } from 'react';
import { X, Plus, PackageCheck } from 'lucide-react';

export default function ResupplyModal({ item, onClose, onConfirm }) {
  const [amountToAdd, setAmountToAdd] = useState(10);

  if (!item) return null;

  const currentStock = Number(item.stock) || 0;
  const newStock = currentStock + (Number(amountToAdd) || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amountToAdd <= 0) return;
    onConfirm(item.id, Number(amountToAdd));
  };

  const quickAmounts = [5, 10, 20, 50];

  return (
    <div className="admin-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <PackageCheck size={20} />
            </div>
            <h2 className="modal-title">Resupply: {item.name}</h2>
          </div>
          <button type="button" className="btn-modal-close-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '14px',
              background: 'rgba(18, 24, 38, 0.7)',
              borderRadius: '12px',
              marginBottom: '18px',
              fontSize: '14px',
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>Current Stock:</span>
            <strong style={{ color: item.stock <= 5 ? 'var(--alert)' : '#ffffff' }}>
              {currentStock} units
            </strong>
          </div>

          <div className="modal-form-group">
            <label className="modal-label">Quantity to Add</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              {quickAmounts.map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setAmountToAdd(qty)}
                  style={{
                    flex: 1,
                    height: '36px',
                    borderRadius: '8px',
                    border:
                      amountToAdd === qty
                        ? '1px solid var(--primary)'
                        : '1px solid var(--border-subtle)',
                    background:
                      amountToAdd === qty
                        ? 'rgba(56, 189, 248, 0.15)'
                        : 'rgba(20, 27, 43, 0.8)',
                    color: amountToAdd === qty ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  +{qty}
                </button>
              ))}
            </div>

            <input
              type="number"
              min="1"
              max="9999"
              className="modal-input"
              value={amountToAdd}
              onChange={(e) => setAmountToAdd(Math.max(1, parseInt(e.target.value) || 0))}
              required
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '14px',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '12px',
              marginTop: '12px',
              fontSize: '14px',
            }}
          >
            <span style={{ color: 'var(--primary)' }}>Projected New Stock:</span>
            <strong style={{ color: '#ffffff', fontSize: '16px' }}>{newStock} units</strong>
          </div>

          <div className="modal-footer-btns">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-modal-submit">
              <PackageCheck size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Confirm Resupply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
