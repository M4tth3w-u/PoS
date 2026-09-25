import React, { useState, useEffect } from 'react';
import {
  Minus,
  Plus,
  Trash2,
  Split,
  QrCode,
  Banknote,
  CreditCard,
  Clock3,
  ShoppingBag,
  CheckCircle2,
  Play,
  Timer,
  Zap,
  Gem,
  Star,
  CircleDot,
} from 'lucide-react';

export default function OrderSummaryColumn({
  selectedTable,
  activeSession,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenSplitBill,
  onPayNow,
  selectedPaymentMethod,
  onSelectPaymentMethod,
  onToggleTableStatus,
}) {
  const [autoFreeCountdown, setAutoFreeCountdown] = useState(null);
  const [sessionHours, setSessionHours] = useState(1);
  const [includeTableRental, setIncludeTableRental] = useState(true);

  const isTableOccupied =
    Boolean(activeSession) ||
    Number(selectedTable?.statusId) === 2 ||
    selectedTable?.status?.toLowerCase() === 'terpakai' ||
    selectedTable?.status?.toLowerCase() === 'in use';

  // Sync sessionHours when activeSession duration changes
  useEffect(() => {
    if (activeSession?.duration) {
      const parsed = parseInt(activeSession.duration, 10);
      if (!isNaN(parsed) && parsed > 0) {
        setSessionHours(parsed);
      }
    }
  }, [activeSession?.duration, selectedTable?.id]);

  // Handle Auto-Free Countdown Timer for FE testing
  useEffect(() => {
    if (autoFreeCountdown === null) return;
    if (autoFreeCountdown <= 0) {
      if (onToggleTableStatus && selectedTable) {
        onToggleTableStatus(selectedTable.id, 'free');
      }
      setAutoFreeCountdown(null);
      return;
    }
    const timer = setTimeout(() => {
      setAutoFreeCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearTimeout(timer);
  }, [autoFreeCountdown, selectedTable, onToggleTableStatus]);

  // Reset countdown if table changes or becomes unoccupied
  useEffect(() => {
    if (!isTableOccupied) {
      setAutoFreeCountdown(null);
    }
  }, [isTableOccupied, selectedTable?.id]);

  // Table Rental Rate
  const tableRentalRate =
    Number(selectedTable?.price) ||
    Number(selectedTable?.price_table) ||
    (selectedTable?.category === 'VVIP' ? 55000 : selectedTable?.category === 'VIP' ? 40000 : 35000);

  const tableRentalTotal = includeTableRental ? tableRentalRate * sessionHours : 0;

  const foodSubtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );

  const overallSubtotal = foodSubtotal + tableRentalTotal;
  const tax = overallSubtotal > 0 ? Math.round(overallSubtotal * 0.04) : 0;
  const total = overallSubtotal + tax;

  const formatPrice = (val) => {
    return new Intl.NumberFormat('id-ID', {
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Extract table number for ball badge
  const numMatch = selectedTable?.name?.match(/\d+/);
  const tableNumber = numMatch ? parseInt(numMatch[0], 10) : '8';

  const getTierClass = (cat = '') => {
    const c = String(cat).toUpperCase();
    if (c.includes('VVIP')) return 'vvip';
    if (c.includes('VIP')) return 'vip';
    return 'standard';
  };
  const tableTier = getTierClass(selectedTable?.category);

  const handlePayClick = () => {
    if (onPayNow) {
      onPayNow(total, {
        tableRentalTotal,
        sessionHours,
        tableRentalRate,
        includeTableRental,
        tableName: selectedTable?.name || 'Meja',
      });
    }
  };

  const handleQuickMethod = (method) => {
    if (onSelectPaymentMethod) {
      onSelectPaymentMethod(method, total, {
        tableRentalTotal,
        sessionHours,
        tableRentalRate,
        includeTableRental,
        tableName: selectedTable?.name || 'Meja',
      });
    }
  };

  return (
    <aside className="cashier-col-summary">
      <div className="pos-col-header">
        <h2 className="pos-col-title">Order Summary</h2>
      </div>

      {/* Selected Table Status Bar (Clean 2-Row Layout, Mind the Gap!) */}
      <div className="order-selected-table-banner">
        {/* Top Row: Identity & Status Indicator */}
        <div className="table-banner-top-row">
          <div className="table-banner-left">
            <div className={`table-mini-ball ${tableTier}`}>{tableNumber}</div>
            <div className="table-meta-wrap">
              <div className="table-title-row">
                <span className="table-name-text">
                  {selectedTable?.name || 'Pilih Meja'}
                </span>
                {selectedTable?.category && (
                  <span className={`table-cat-badge ${tableTier}`}>
                    {tableTier === 'vvip' ? (
                      <Gem size={10} />
                    ) : tableTier === 'vip' ? (
                      <Star size={10} />
                    ) : (
                      <CircleDot size={10} />
                    )}
                    <span>{selectedTable.category}</span>
                  </span>
                )}
              </div>
              <span className="table-rate-sub">
                Rp {formatPrice(tableRentalRate)} / jam
              </span>
            </div>
          </div>

          {/* Interactive Changeable Status Pill */}
          {selectedTable && (
            <button
              type="button"
              className={`table-status-chip ${isTableOccupied ? 'terpakai' : 'kosong'}`}
              onClick={() =>
                onToggleTableStatus &&
                onToggleTableStatus(selectedTable.id, isTableOccupied ? 'free' : 'occupy')
              }
              title="Klik untuk ubah status meja (Terpakai / Kosong)"
            >
              <span className="status-indicator-dot" />
              <span>{isTableOccupied ? 'TERPAKAI' : 'KOSONG'}</span>
            </button>
          )}
        </div>

        {/* Bottom Row: Action Buttons Group (Never Wrap Text) */}
        <div className="table-banner-actions-row">
          {selectedTable &&
            (isTableOccupied ? (
              <button
                type="button"
                className="btn-desk-action-pill free"
                onClick={() => onToggleTableStatus && onToggleTableStatus(selectedTable.id, 'free')}
                title="Selesai bermain & kosongkan meja kembali ke Hijau"
              >
                <CheckCircle2 size={14} />
                <span>Kosongkan Meja</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn-desk-action-pill occupy"
                onClick={() => onToggleTableStatus && onToggleTableStatus(selectedTable.id, 'occupy')}
                title="Tandai meja terpakai untuk mulai bermain"
              >
                <Play size={14} />
                <span>Mulai Sesi</span>
              </button>
            ))}

          <button
            type="button"
            className="btn-split-bill"
            onClick={onOpenSplitBill}
            title="Gabung atau Split Tagihan"
          >
            <Split size={14} />
            <span>Split Bill</span>
          </button>
        </div>
      </div>

      {/* Active Session Info Strip */}
      {isTableOccupied && (
        <div className="active-session-status-strip">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: 'var(--text-muted, #94a3b8)',
              flexWrap: 'wrap',
            }}
          >
            <Timer size={13} color="var(--primary, #38bdf8)" />
            <span>
              Mulai: <strong style={{ color: '#f8fafc' }}>{activeSession?.startTime || 'Baru Mulai'}</strong>
            </span>
            {activeSession?.duration && (
              <span className="session-duration-tag">{activeSession.duration}</span>
            )}
            {activeSession?.isPending && <span className="session-pending-tag">Pending</span>}
            {autoFreeCountdown !== null ? (
              <span className="session-autofree-badge active" title="Meja akan otomatis kosong saat hitungan habis">
                <Zap size={11} /> Auto-Free {autoFreeCountdown}s
              </span>
            ) : (
              <button
                type="button"
                className="session-autofree-badge"
                onClick={() => setAutoFreeCountdown(15)}
                title="FE Testing: Mulai hitung mundur 15 detik untuk mengosongkan meja secara otomatis"
              >
                <Zap size={11} /> Auto-Free (15s)
              </button>
            )}
          </div>

          <button
            type="button"
            className="btn-text-link-danger"
            onClick={() => {
              setAutoFreeCountdown(null);
              onToggleTableStatus && onToggleTableStatus(selectedTable.id, 'free');
            }}
            title="Selesai bermain & kosongkan meja sekarang"
          >
            Selesai Main
          </button>
        </div>
      )}

      {/* Table Rental Price Line Item Card */}
      {selectedTable && (
        <div className="table-rental-pricing-card">
          <div className="table-rental-card-top">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="checkbox-table-fee"
                checked={includeTableRental}
                onChange={(e) => setIncludeTableRental(e.target.checked)}
                className="table-fee-checkbox"
                title="Centang untuk sertakan biaya sewa meja ke tagihan"
              />
              <label htmlFor="checkbox-table-fee" className="table-rental-label">
                Sewa Meja ({selectedTable.name})
              </label>
            </div>
            <span className="table-rental-price-value">
              Rp {formatPrice(tableRentalTotal)}
            </span>
          </div>

          {includeTableRental && (
            <div className="table-rental-card-controls">
              <span style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)' }}>
                Durasi Sewa:
              </span>
              <div className="hours-stepper-wrap">
                <button
                  type="button"
                  className="btn-hour-step"
                  onClick={() => setSessionHours((prev) => Math.max(1, prev - 1))}
                  disabled={sessionHours <= 1}
                  title="Kurangi jam"
                >
                  <Minus size={11} />
                </button>
                <span className="hours-count-text">{sessionHours} Jam</span>
                <button
                  type="button"
                  className="btn-hour-step"
                  onClick={() => setSessionHours((prev) => Math.min(12, prev + 1))}
                  title="Tambah jam"
                >
                  <Plus size={11} />
                </button>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--primary, #38bdf8)', marginLeft: 'auto' }}>
                @ Rp {formatPrice(tableRentalRate)}/jam
              </span>
            </div>
          )}
        </div>
      )}

      {/* Cart Items List */}
      <div className="order-items-list-area">
        {cartItems.length === 0 ? (
          <div className="empty-cart-view">
            <ShoppingBag size={34} color="#64748b" />
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>
              Belum Ada Pesanan F&amp;B
            </p>
            <span style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)' }}>
              Biaya sewa meja tetap terhitung di bawah. Klik menu untuk menambah makanan/minuman.
            </span>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="order-cart-row">
              <div className="cart-row-top">
                <div>
                  <h4 className="cart-item-name">{item.name}</h4>
                  {item.startTime && (
                    <span className="cart-item-details">Mulai: {item.startTime}</span>
                  )}
                </div>
                <span className="cart-item-price">
                  {formatPrice(item.price * (item.quantity || 1))}
                </span>
              </div>

              <div className="cart-row-bottom">
                <button
                  type="button"
                  className="btn-cart-qty"
                  onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                  title="Kurangi"
                  aria-label="Kurangi jumlah"
                >
                  <Minus size={12} />
                </button>

                <span className="cart-item-qty">{item.quantity || 1}</span>

                <button
                  type="button"
                  className="btn-cart-qty plus"
                  onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                  title="Tambah"
                  aria-label="Tambah jumlah"
                >
                  <Plus size={12} />
                </button>

                <button
                  type="button"
                  className="btn-cart-trash"
                  onClick={() => onRemoveItem(item.id)}
                  title="Hapus dari pesanan"
                  aria-label="Hapus item"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Calculation Panel */}
      <div className="order-calculation-panel">
        {foodSubtotal > 0 && (
          <div className="calc-row">
            <span>Subtotal F&amp;B:</span>
            <span style={{ fontWeight: 600 }}>Rp {formatPrice(foodSubtotal)}</span>
          </div>
        )}

        {includeTableRental && tableRentalTotal > 0 && (
          <div className="calc-row">
            <span>Sewa Meja ({sessionHours} Jam):</span>
            <span style={{ fontWeight: 600, color: 'var(--primary, #38bdf8)' }}>
              Rp {formatPrice(tableRentalTotal)}
            </span>
          </div>
        )}

        {overallSubtotal > 0 && (
          <div className="calc-row">
            <span>Tax (4%):</span>
            <span style={{ fontWeight: 600 }}>Rp {formatPrice(tax)}</span>
          </div>
        )}

        <div className="calc-row total">
          <span>Total:</span>
          <span>Rp {formatPrice(total)}</span>
        </div>

        {/* Pay Now Button (Active even with 0 food items if table rental > 0) */}
        <button
          type="button"
          className="btn-pay-now"
          disabled={total <= 0}
          onClick={handlePayClick}
        >
          Pay Now (Rp {formatPrice(total)})
        </button>

        {/* Quick Payment Method Badges */}
        <div className="payment-methods-quick-row">
          <button
            type="button"
            className={`btn-pay-method-quick ${
              selectedPaymentMethod === 'qris' ? 'active' : ''
            }`}
            onClick={() => handleQuickMethod('qris')}
          >
            <QrCode size={15} />
            <span>QRIS</span>
          </button>

          <button
            type="button"
            className={`btn-pay-method-quick ${
              selectedPaymentMethod === 'cash' ? 'active' : ''
            }`}
            onClick={() => handleQuickMethod('cash')}
          >
            <Banknote size={15} />
            <span>Cash</span>
          </button>

          <button
            type="button"
            className={`btn-pay-method-quick ${
              selectedPaymentMethod === 'card' ? 'active' : ''
            }`}
            onClick={() => handleQuickMethod('card')}
          >
            <CreditCard size={15} />
            <span>Kartu</span>
          </button>

          <button
            type="button"
            className={`btn-pay-method-quick ${
              selectedPaymentMethod === 'pending' ? 'active' : ''
            }`}
            onClick={() => handleQuickMethod('pending')}
          >
            <Clock3 size={15} />
            <span>Pending</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
