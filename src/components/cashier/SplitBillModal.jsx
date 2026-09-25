import React, { useState } from 'react';
import {
  X,
  Users,
  Calculator,
  Check,
  Minus,
  Plus,
  ArrowRight,
  Receipt,
  UserCheck,
} from 'lucide-react';

export default function SplitBillModal({
  isOpen,
  onClose,
  totalAmount,
  tableName = 'Meja',
  onProceedWithSplitAmount,
}) {
  if (!isOpen) return null;

  const [splitMode, setSplitMode] = useState('single'); // 'single' | 'equal' | 'custom'
  const [guestCount, setGuestCount] = useState(1);
  const [customFirstPay, setCustomFirstPay] = useState('');

  const formatPrice = (val) => {
    return new Intl.NumberFormat('id-ID', {
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Safe guest count between 1 and 50 (allowing 1 person to pay for all)
  const safeCount = Math.max(1, Math.min(50, Number(guestCount) || 1));
  const perPersonEqual = Math.ceil(totalAmount / safeCount);

  // Custom partial calculation
  const firstPayAmount = Math.max(0, Math.min(totalAmount, Number(customFirstPay) || 0));
  const remainingTotal = Math.max(0, totalAmount - firstPayAmount);
  const remainingCount = Math.max(1, safeCount - 1);
  const perPersonRemaining = Math.ceil(remainingTotal / remainingCount);

  const quickPillOptions = [1, 2, 3, 4, 5, 6, 8, 10];

  const handleApply = (amountToPay) => {
    if (onProceedWithSplitAmount) {
      onProceedWithSplitAmount(amountToPay, safeCount);
    }
    onClose();
  };

  return (
    <div className="pos-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pos-modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="pos-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={18} color="var(--primary, #38bdf8)" />
            <h3 className="pos-modal-title">Split Bill - {tableName}</h3>
          </div>
          <button type="button" className="btn-pos-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="pos-modal-body">
          {/* Total Bill Banner */}
          <div
            style={{
              background: 'var(--surface-input, #141b2b)',
              border: '1px solid var(--border-subtle, rgba(226, 232, 240, 0.08))',
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', fontWeight: 600, textTransform: 'uppercase' }}>
                Total Tagihan Meja
              </span>
              <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--primary, #38bdf8)', marginTop: '2px' }}>
                Rp {formatPrice(totalAmount)}
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.12)',
                color: 'var(--primary, #38bdf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Receipt size={22} />
            </div>
          </div>

          {/* Split Mode Selector Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              className={`btn-category-pill ${splitMode === 'single' ? 'active' : ''}`}
              onClick={() => {
                setSplitMode('single');
                setGuestCount(1);
              }}
              style={{ padding: '9px 8px', textAlign: 'center', fontSize: '12px' }}
            >
              1 Org (Semua)
            </button>
            <button
              type="button"
              className={`btn-category-pill ${splitMode === 'equal' ? 'active' : ''}`}
              onClick={() => {
                setSplitMode('equal');
                if (guestCount <= 1) setGuestCount(2);
              }}
              style={{ padding: '9px 8px', textAlign: 'center', fontSize: '12px' }}
            >
              Bagi Rata (Equal)
            </button>
            <button
              type="button"
              className={`btn-category-pill ${splitMode === 'custom' ? 'active' : ''}`}
              onClick={() => {
                setSplitMode('custom');
                if (guestCount <= 1) setGuestCount(2);
              }}
              style={{ padding: '9px 8px', textAlign: 'center', fontSize: '12px' }}
            >
              Nominal Kustom
            </button>
          </div>

          {/* Mode 1: 1 Person Pay All (Single) */}
          {splitMode === 'single' && (
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1.5px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '12px',
                padding: '22px 18px',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: 'var(--primary, #38bdf8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px',
                }}
              >
                <UserCheck size={22} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary, #38bdf8)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                1 Orang Bayar Semua (Full Bill)
              </span>
              <div
                style={{
                  fontSize: '30px',
                  fontWeight: 900,
                  color: '#ffffff',
                  marginTop: '4px',
                  letterSpacing: '0.5px',
                }}
              >
                Rp {formatPrice(totalAmount)}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', marginTop: '6px', display: 'block' }}>
                Satu orang menanggung seluruh tagihan meja ini (100%) tanpa dibagi ke tamu lain.
              </span>
            </div>
          )}

          {/* Guest Count Controls (Shown only for Equal & Custom modes) */}
          {splitMode !== 'single' && (
            <div
              style={{
                background: 'var(--surface-input, #141b2b)',
                border: '1px solid var(--border-subtle, rgba(226, 232, 240, 0.08))',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={15} color="var(--primary, #38bdf8)" />
                  <span>Jumlah Tamu / Orang:</span>
                </label>

                {/* Stepper with direct numeric typing */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    className="btn-cart-qty"
                    onClick={() => setGuestCount((prev) => Math.max(1, (Number(prev) || 1) - 1))}
                    title="Kurangi tamu"
                    aria-label="Kurangi tamu"
                  >
                    <Minus size={13} />
                  </button>

                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={guestCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setGuestCount(isNaN(val) ? '' : val);
                    }}
                    onBlur={() => {
                      if (!guestCount || guestCount < 1) setGuestCount(1);
                      else if (guestCount > 50) setGuestCount(50);
                    }}
                    style={{
                      width: '54px',
                      height: '28px',
                      textAlign: 'center',
                      background: 'var(--surface, #1e2536)',
                      border: '1px solid var(--border-subtle, rgba(226, 232, 240, 0.15))',
                      borderRadius: '6px',
                      color: '#f8fafc',
                      fontSize: '14px',
                      fontWeight: 800,
                      outline: 'none',
                    }}
                  />

                  <button
                    type="button"
                    className="btn-cart-qty plus"
                    onClick={() => setGuestCount((prev) => Math.min(50, (Number(prev) || 1) + 1))}
                    title="Tambah tamu"
                    aria-label="Tambah tamu"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* Quick Pills up to 10 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {quickPillOptions.map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuestCount(num)}
                    style={{
                      flex: '1 1 calc(25% - 6px)',
                      minWidth: '55px',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor:
                        safeCount === num
                          ? 'var(--primary, #38bdf8)'
                          : 'var(--border-subtle, rgba(226, 232, 240, 0.08))',
                      background:
                        safeCount === num
                          ? 'rgba(56, 189, 248, 0.15)'
                          : 'var(--surface, #1e2536)',
                      color: safeCount === num ? 'var(--primary, #38bdf8)' : 'var(--text-muted, #94a3b8)',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {num === 1 ? '1 Org (Semua)' : `${num} Org`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mode 1: Equal Split Calculation Card */}
          {splitMode === 'equal' && (
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1.5px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '12px',
                padding: '18px',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary, #38bdf8)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                {safeCount === 1 ? '1 Orang Bayar Semua (Full Bill)' : `Tagihan Per Orang (${safeCount} Tamu)`}
              </span>
              <div
                style={{
                  fontSize: '30px',
                  fontWeight: 900,
                  color: '#ffffff',
                  marginTop: '4px',
                  letterSpacing: '0.5px',
                }}
              >
                Rp {formatPrice(perPersonEqual)}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', marginTop: '4px', display: 'block' }}>
                {safeCount === 1
                  ? 'Satu orang menanggung seluruh tagihan meja tanpa dibagi'
                  : `Total: Rp ${formatPrice(totalAmount)} • Pembagian rata tanpa sisa`}
              </span>
            </div>
          )}

          {/* Mode 2: Custom / Partial Split */}
          {splitMode === 'custom' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  background: 'var(--surface-input, #141b2b)',
                  border: '1px solid var(--border-subtle, rgba(226, 232, 240, 0.08))',
                  borderRadius: '10px',
                  padding: '12px 14px',
                }}
              >
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc', display: 'block', marginBottom: '6px' }}>
                  Nominal Dibayar Tamu 1 (Rp):
                </label>
                <input
                  type="number"
                  placeholder="Contoh: 100000"
                  value={customFirstPay}
                  onChange={(e) => setCustomFirstPay(e.target.value)}
                  className="menu-search-input"
                  style={{ fontSize: '15px', fontWeight: 700 }}
                />
              </div>

              <div
                style={{
                  background: 'rgba(52, 211, 153, 0.08)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  borderRadius: '10px',
                  padding: '14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted, #94a3b8)', marginBottom: '4px' }}>
                  <span>Tamu 1 Membayar:</span>
                  <strong style={{ color: '#f8fafc' }}>Rp {formatPrice(firstPayAmount)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted, #94a3b8)', marginBottom: '6px' }}>
                  <span>Sisa Tagihan ({remainingCount} tamu lain):</span>
                  <strong style={{ color: 'var(--alert, #f87171)' }}>Rp {formatPrice(remainingTotal)}</strong>
                </div>
                <div style={{ borderTop: '1px dashed rgba(226, 232, 240, 0.12)', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--success, #34d399)' }}>
                    Tiap Tamu Sisanya:
                  </span>
                  <span style={{ fontSize: '17px', fontWeight: 900, color: 'var(--success, #34d399)' }}>
                    Rp {formatPrice(perPersonRemaining)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pos-modal-footer">
          <button type="button" className="btn-pos-secondary" onClick={onClose}>
            Tutup
          </button>

          <button
            type="button"
            className="btn-pos-primary"
            onClick={() =>
              handleApply(
                splitMode === 'single'
                  ? totalAmount
                  : splitMode === 'equal'
                  ? perPersonEqual
                  : firstPayAmount || perPersonEqual
              )
            }
          >
            <UserCheck size={16} />
            <span>
              {splitMode === 'single'
                ? `Bayar Penuh Rp ${formatPrice(totalAmount)} (1 Orang)`
                : splitMode === 'equal'
                ? safeCount === 1
                  ? `Bayar Penuh Rp ${formatPrice(totalAmount)} (1 Orang)`
                  : `Bayar Rp ${formatPrice(perPersonEqual)} (1 Orang)`
                : `Bayar Tamu 1 (Rp ${formatPrice(firstPayAmount || perPersonEqual)})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
