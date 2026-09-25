import React, { useState } from 'react';
import {
  X,
  QrCode,
  Banknote,
  CreditCard,
  Clock3,
  CheckCircle2,
  Printer,
} from 'lucide-react';

export default function PaymentModal({
  isOpen,
  onClose,
  totalAmount,
  tableName,
  cartItems = [],
  tableRentalInfo = null,
  initialMethod = 'qris',
  onCompletePayment,
}) {
  if (!isOpen) return null;

  const [method, setMethod] = useState(initialMethod);
  const [cashGiven, setCashGiven] = useState(totalAmount);
  const [cardRef, setCardRef] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const formatPrice = (val) => {
    return new Intl.NumberFormat('id-ID', {
      maximumFractionDigits: 0,
    }).format(val);
  };

  const cashChange = Math.max(0, (Number(cashGiven) || 0) - totalAmount);

  const quickCashOptions = [
    { label: 'Uang Pas', value: totalAmount },
    { label: '50.000', value: 50000 },
    { label: '100.000', value: 100000 },
    { label: '200.000', value: 200000 },
    { label: '500.000', value: 500000 },
  ];

  const handleConfirm = () => {
    if (method === 'pending') {
      // Pending payment immediately marks desk as occupied (Red)
      onCompletePayment({
        method: 'pending',
        totalAmount,
        cashGiven: 0,
        cashChange: 0,
        timestamp: new Date().toLocaleTimeString('id-ID'),
        deskAction: 'keep_occupied',
        tableRentalInfo,
      });
      setIsSuccess(false);
      return;
    }
    setIsSuccess(true);
  };

  const handleFinish = (deskAction = 'free_desk') => {
    onCompletePayment({
      method,
      totalAmount,
      cashGiven: method === 'cash' ? cashGiven : totalAmount,
      cashChange: method === 'cash' ? cashChange : 0,
      timestamp: new Date().toLocaleTimeString('id-ID'),
      deskAction, // 'keep_occupied' | 'free_desk'
      tableRentalInfo,
    });
    setIsSuccess(false);
  };

  return (
    <div className="pos-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pos-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="pos-modal-header">
          <h3 className="pos-modal-title">
            {isSuccess ? 'Struk Pembayaran' : `Pembayaran - ${tableName}`}
          </h3>
          <button type="button" className="btn-pos-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {!isSuccess ? (
          <>
            <div className="pos-modal-body">
              {/* Total Due Banner */}
              <div
                style={{
                  background: 'var(--pos-teal-soft)',
                  border: '1px solid rgba(0, 121, 107, 0.25)',
                  borderRadius: '10px',
                  padding: '16px',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--pos-teal)' }}>
                  TOTAL PEMBAYARAN
                </span>
                <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--pos-teal-dark)', marginTop: '4px' }}>
                  Rp {formatPrice(totalAmount)}
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '8px' }}>
                  Metode Pembayaran
                </label>
                <div className="payment-tabs-grid">
                  <button
                    type="button"
                    className={`payment-tab-btn ${method === 'qris' ? 'active' : ''}`}
                    onClick={() => setMethod('qris')}
                  >
                    <QrCode size={18} />
                    <span>QRIS</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-tab-btn ${method === 'cash' ? 'active' : ''}`}
                    onClick={() => setMethod('cash')}
                  >
                    <Banknote size={18} />
                    <span>Tunai</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-tab-btn ${method === 'card' ? 'active' : ''}`}
                    onClick={() => setMethod('card')}
                  >
                    <CreditCard size={18} />
                    <span>Kartu EDC</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-tab-btn ${method === 'pending' ? 'active' : ''}`}
                    onClick={() => setMethod('pending')}
                  >
                    <Clock3 size={18} />
                    <span>Pending</span>
                  </button>
                </div>
              </div>

              {/* Method-Specific Inputs */}
              {method === 'qris' && (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div
                    style={{
                      width: '180px',
                      height: '180px',
                      margin: '0 auto',
                      padding: '10px',
                      background: '#ffffff',
                      border: '2px dashed var(--pos-teal)',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    }}
                  >
                    <QrCode size={130} color="#0f172a" />
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', marginTop: '4px' }}>
                      SCAN VIA QRIS
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>
                    Mendukung BCA, Mandiri, GoPay, OVO, ShopeePay, Dana &amp; LinkAja
                  </p>
                </div>
              )}

              {method === 'cash' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                      Uang Diterima (Rp)
                    </label>
                    <input
                      type="number"
                      value={cashGiven}
                      onChange={(e) => setCashGiven(Number(e.target.value) || 0)}
                      className="menu-search-input"
                      style={{ fontSize: '16px', fontWeight: 700, padding: '8px 12px' }}
                    />
                  </div>

                  <div className="cash-pills-row">
                    {quickCashOptions.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        className="btn-cash-pill"
                        onClick={() => setCashGiven(opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <div className="cash-change-box">
                    <span className="cash-change-label">Kembalian:</span>
                    <span className="cash-change-amount">
                      Rp {formatPrice(cashChange)}
                    </span>
                  </div>
                </div>
              )}

              {method === 'card' && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    Nomor Approval / Ref Kartu
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: REF-983142"
                    value={cardRef}
                    onChange={(e) => setCardRef(e.target.value)}
                    className="menu-search-input"
                  />
                  <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                    Gesek kartu di mesin EDC dan masukkan nomor referensi bukti transaksi.
                  </span>
                </div>
              )}

              {method === 'pending' && (
                <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '12px', borderRadius: '8px', color: '#b45309', fontSize: '12px' }}>
                  Tagihan akan disimpan dalam status <strong>Pending Payment</strong>. Meja tetap aktif bermain dan pembayaran dapat diselesaikan saat checkout nanti.
                </div>
              )}
            </div>

            <div className="pos-modal-footer">
              <button type="button" className="btn-pos-secondary" onClick={onClose}>
                Batal
              </button>
              <button
                type="button"
                className="btn-pos-primary"
                onClick={handleConfirm}
                disabled={method === 'cash' && cashGiven < totalAmount}
              >
                <CheckCircle2 size={16} />
                <span>{method === 'pending' ? 'Simpan Pending' : 'Selesaikan Pembayaran'}</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="pos-modal-body">
              {/* Receipt Preview Paper */}
              <div className="receipt-paper">
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                  <strong style={{ fontSize: '15px', display: 'block' }}>CUE &amp; DINE POS</strong>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Billiard &amp; Cafe Diner</span>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                    {new Date().toLocaleDateString('id-ID')} - {new Date().toLocaleTimeString('id-ID')}
                  </div>
                </div>

                <div className="receipt-divider" />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span>Meja: <strong>{tableName}</strong></span>
                  <span>Metode: <strong>{method.toUpperCase()}</strong></span>
                </div>

                <div className="receipt-divider" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {tableRentalInfo?.includeTableRental && tableRentalInfo.tableRentalTotal > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0369a1', fontWeight: 600 }}>
                      <span>Sewa {tableName} ({tableRentalInfo.sessionHours || 1} Jam)</span>
                      <span>Rp {formatPrice(tableRentalInfo.tableRentalTotal)}</span>
                    </div>
                  )}
                  {cartItems.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{item.name} x{item.quantity || 1}</span>
                      <span>{formatPrice((item.price || 0) * (item.quantity || 1))}</span>
                    </div>
                  ))}
                </div>

                <div className="receipt-divider" />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>TOTAL:</span>
                  <span>Rp {formatPrice(totalAmount)}</span>
                </div>

                {method === 'cash' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginTop: '4px' }}>
                      <span>Bayar Tunai:</span>
                      <span>Rp {formatPrice(cashGiven)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 'bold' }}>
                      <span>Kembalian:</span>
                      <span>Rp {formatPrice(cashChange)}</span>
                    </div>
                  </>
                )}

                <div className="receipt-divider" />
                <div style={{ textAlign: 'center', fontSize: '10px', color: '#94a3b8' }}>
                  Terima kasih atas kunjungan Anda!
                </div>
              </div>
            </div>

            <div className="pos-modal-footer" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-pos-secondary"
                onClick={() => window.print()}
              >
                <Printer size={15} style={{ display: 'inline', marginRight: '5px' }} />
                <span>Cetak Struk</span>
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-pos-secondary"
                  onClick={() => handleFinish('keep_occupied')}
                  title="Tamu mulai bermain, meja tetap Terpakai (Merah)"
                >
                  Mulai Main (Set Terpakai)
                </button>
                <button
                  type="button"
                  className="btn-pos-primary"
                  onClick={() => handleFinish('free_desk')}
                  title="Selesai bermain, kosongkan meja kembali ke Hijau"
                >
                  Checkout (Set Kosong)
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
