import React, { useState, useEffect } from 'react';
import CashierHeader from './cashier/CashierHeader';
import TableStatusColumn from './cashier/TableStatusColumn';
import MenuCatalogColumn from './cashier/MenuCatalogColumn';
import OrderSummaryColumn from './cashier/OrderSummaryColumn';
import PaymentModal from './cashier/PaymentModal';
import SplitBillModal from './cashier/SplitBillModal';
import { apiUrl } from '../config/api';
import './Cashier.css';

// Default 12 billiard tables to guarantee identical layout to reference photo
const DEFAULT_TABLES = [
  { id: 't-1', name: 'Table 1', category: 'Standart', price: 35000, statusId: 1, status: 'Kosong' },
  { id: 't-2', name: 'Table 2', category: 'Standart', price: 35000, statusId: 2, status: 'Terpakai' },
  { id: 't-3', name: 'Table 3', category: 'Standart', price: 35000, statusId: 1, status: 'Kosong' },
  { id: 't-4', name: 'Table 4', category: 'Standart', price: 35000, statusId: 1, status: 'Kosong' },
  { id: 't-5', name: 'Table 5', category: 'VIP', price: 40000, statusId: 2, status: 'Terpakai' },
  { id: 't-6', name: 'Table 6', category: 'VIP', price: 40000, statusId: 2, status: 'Terpakai' },
  { id: 't-7', name: 'Table 7', category: 'Standart', price: 35000, statusId: 1, status: 'Kosong' },
  { id: 't-8', name: 'Table 8', category: 'Standart', price: 35000, statusId: 1, status: 'Kosong' },
  { id: 't-9', name: 'Table 9', category: 'Standart', price: 35000, statusId: 1, status: 'Kosong' },
  { id: 't-10', name: 'Table 10', category: 'VIP', price: 40000, statusId: 2, status: 'Terpakai' },
  { id: 't-11', name: 'Table 11', category: 'Standart', price: 35000, statusId: 1, status: 'Kosong' },
  { id: 't-12', name: 'Table 12', category: 'VVIP', price: 55000, statusId: 1, status: 'Kosong' },
];

export default function CashierView({ user, onLogout }) {
  const [tables, setTables] = useState(DEFAULT_TABLES);
  const [foods, setFoods] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);

  // Active Sessions for occupied tables (matching reference photo preloaded items)
  const [activeSessions, setActiveSessions] = useState({
    't-2': { startTime: '19:00', duration: '1 Jam' },
    't-5': { startTime: '19:30', duration: '2 Jam' },
    't-6': { startTime: '20:05', duration: '1 Jam' },
    't-10': { startTime: '20:20', duration: '2 Jam' },
  });

  // Selected table ID (derive selectedTable reactively from tables to prevent stale state)
  const [selectedTableId, setSelectedTableId] = useState('t-5');
  const selectedTable =
    tables.find((t) => String(t.id) === String(selectedTableId)) ||
    tables[0] ||
    DEFAULT_TABLES[4];

  // Carts by table ID
  const [tableCarts, setTableCarts] = useState({
    't-5': [
      {
        id: 'pkg-2',
        name: 'Paket B (2 Jam)',
        price: 150000,
        quantity: 1,
        startTime: '19:30',
      },
      {
        id: 'dine-2',
        name: 'Ayam Geprek',
        price: 45000,
        quantity: 1,
      },
      {
        id: 'dine-3',
        name: 'French Fries',
        price: 30000,
        quantity: 1,
      },
      {
        id: 'dine-5',
        name: 'Iced Lychee Tea',
        price: 25000,
        quantity: 1,
      },
    ],
  });

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSplitBillModalOpen, setIsSplitBillModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('qris');
  const [paymentTotal, setPaymentTotal] = useState(0);
  const [paymentTableRental, setPaymentTableRental] = useState(null);

  // Fetch tables and foods from backend
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        // Fetch Tables
        const resTables = await fetch(apiUrl('/admin/table'), {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });
        const tablesJson = await resTables.json();
        if (tablesJson?.success && Array.isArray(tablesJson.data) && tablesJson.data.length > 0) {
          const mappedTables = tablesJson.data.map((t) => ({
            id: String(t.id_table || t.id),
            name: t.name_table || `Table ${t.id_table}`,
            category: t.name_category_table || 'Standart',
            price: Number(t.price_table || (t.name_category_table === 'VVIP' ? 55000 : t.name_category_table === 'VIP' ? 40000 : 35000)),
            statusId: Number(t.id_status_table || 1),
            status: t.name_status_table || 'Ready',
          }));

          // Merge with DEFAULT_TABLES to ensure at least 12 billiard tables are rendered
          const merged = [...mappedTables];
          DEFAULT_TABLES.forEach((def) => {
            if (!merged.some((m) => m.name.toLowerCase() === def.name.toLowerCase())) {
              merged.push(def);
            }
          });
          setTables(merged);
        }
      } catch (err) {
        console.error('Failed to load tables from backend', err);
      }

      try {
        // Fetch Foods
        const resFoods = await fetch(apiUrl('/admin/food'), {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });
        const foodsJson = await resFoods.json();
        if (foodsJson?.success && Array.isArray(foodsJson.data)) {
          setFoods(
            foodsJson.data.map((f) => ({
              id: String(f.id_food || f.id),
              name: f.name_food || f.name,
              category: f.name_type_food || 'MAKANAN BERAT',
              price: Number(f.price_food || f.price || 0),
              image: f.img_food || f.image,
              isAvailable: Number(f.id_status_food) === 1,
            }))
          );
        }
      } catch (err) {
        console.error('Failed to load foods from backend', err);
      }

      try {
        // Fetch Food Types
        const resTypes = await fetch(apiUrl('/admin/type-food'), {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });
        const typesJson = await resTypes.json();
        if (typesJson?.success && Array.isArray(typesJson.data)) {
          setFoodTypes(typesJson.data);
        }
      } catch (err) {
        console.error('Failed to load food types', err);
      }
    };

    fetchBackendData();
  }, []);

  const activeTableId = selectedTable?.id || 't-1';
  const currentCart = tableCarts[activeTableId] || [];

  // Table selection
  const handleSelectTable = (table) => {
    setSelectedTableId(String(table.id));
  };

  // Add Item to Cart for currently selected table
  const handleAddToCart = (item) => {
    const tableId = activeTableId;
    const nowTime = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setTableCarts((prev) => {
      const existingCart = prev[tableId] || [];
      const itemIndex = existingCart.findIndex((ci) => ci.id === item.id);

      if (itemIndex > -1) {
        const updated = [...existingCart];
        updated[itemIndex] = {
          ...updated[itemIndex],
          quantity: (updated[itemIndex].quantity || 1) + 1,
        };
        return { ...prev, [tableId]: updated };
      }

      return {
        ...prev,
        [tableId]: [
          ...existingCart,
          {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            startTime: item.category === 'PAKET' ? nowTime : null,
          },
        ],
      };
    });

    // If a billiard package was added, activate table session
    if (item.category === 'PAKET') {
      setActiveSessions((prev) => ({
        ...prev,
        [tableId]: {
          startTime: nowTime,
          duration: item.durationMinutes ? `${item.durationMinutes / 60} Jam` : '1 Jam',
        },
      }));
    }
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (itemId, newQty) => {
    const tableId = activeTableId;
    setTableCarts((prev) => {
      const existingCart = prev[tableId] || [];
      if (newQty <= 0) {
        return {
          ...prev,
          [tableId]: existingCart.filter((item) => item.id !== itemId),
        };
      }
      return {
        ...prev,
        [tableId]: existingCart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQty } : item
        ),
      };
    });
  };

  // Remove Item
  const handleRemoveItem = (itemId) => {
    const tableId = activeTableId;
    setTableCarts((prev) => ({
      ...prev,
      [tableId]: (prev[tableId] || []).filter((item) => item.id !== itemId),
    }));
  };

  // Clear Cart
  const handleClearCart = () => {
    const tableId = activeTableId;
    setTableCarts((prev) => ({
      ...prev,
      [tableId]: [],
    }));
  };

  // Pay Now clicked with full total including table rental
  const handlePayNow = (total, tableRentalInfo) => {
    setPaymentTotal(total);
    setPaymentTableRental(tableRentalInfo);
    setIsPaymentModalOpen(true);
  };

  // Quick Payment method select with total and table rental
  const handleSelectQuickPaymentMethod = (method, total, tableRentalInfo) => {
    setSelectedPaymentMethod(method);
    if (total && total > 0) {
      setPaymentTotal(total);
      setPaymentTableRental(tableRentalInfo);
      setIsPaymentModalOpen(true);
    }
  };

  // Toggle Table Status (Kosong vs Terpakai) - Functional for FE Testing & Operations
  const handleToggleTableStatus = (tableId, action) => {
    const targetTableId = String(tableId);
    const nowTime = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (action === 'free') {
      // Free the table (statusId: 1, Kosong)
      setTables((prev) =>
        prev.map((t) =>
          String(t.id) === targetTableId
            ? { ...t, statusId: 1, status: 'Kosong' }
            : t
        )
      );

      // Remove from active sessions
      setActiveSessions((prev) => {
        const next = { ...prev };
        delete next[targetTableId];
        return next;
      });

      // Clear cart
      setTableCarts((prev) => ({
        ...prev,
        [targetTableId]: [],
      }));
    } else if (action === 'occupy') {
      // Occupy the table (statusId: 2, Terpakai)
      setTables((prev) =>
        prev.map((t) =>
          String(t.id) === targetTableId
            ? { ...t, statusId: 2, status: 'Terpakai' }
            : t
        )
      );

      // Start active session
      setActiveSessions((prev) => ({
        ...prev,
        [targetTableId]: {
          startTime: nowTime,
          duration: '1 Jam',
          isPending: false,
        },
      }));
    }
  };

  // Complete Payment (Structured cleanly so future backend order endpoint hooks up effortlessly)
  const handleCompletePayment = (paymentData) => {
    const tableId = String(activeTableId);
    const nowTime = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const isPending = paymentData.method === 'pending';
    const isKeepOccupied = paymentData.deskAction === 'keep_occupied' || isPending;

    // Structured transaction record ready for future backend order API
    const tableRentalFee = paymentData.tableRentalInfo?.tableRentalTotal || 0;
    const foodSubtotal = currentCart.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
      0
    );
    const subtotal = foodSubtotal + tableRentalFee;
    const tax = subtotal > 0 ? Math.round(subtotal * 0.04) : 0;

    const transactionRecord = {
      id_table: selectedTable?.id,
      name_table: selectedTable?.name,
      table_rental: paymentData.tableRentalInfo || null,
      items: currentCart.map((item) => ({
        id_food: item.id,
        name_food: item.name,
        price_food: item.price,
        qty: item.quantity || 1,
        subtotal: item.price * (item.quantity || 1),
      })),
      subtotal,
      tax,
      total_price: paymentData.totalAmount || (subtotal + tax),
      payment_method: paymentData.method,
      cash_given: paymentData.cashGiven,
      cash_change: paymentData.cashChange,
      status_payment: isPending ? 'pending' : 'paid',
      created_at: new Date().toISOString(),
      cashier_id: user?.id_user || user?.id,
      cashier_name: user?.username,
    };

    console.info('[Cashier] Transaction processed (ready for backend save):', transactionRecord);

    if (isKeepOccupied) {
      // Mark table Terpakai (statusId: 2)
      setTables((prev) =>
        prev.map((t) =>
          String(t.id) === tableId
            ? { ...t, statusId: 2, status: 'Terpakai' }
            : t
        )
      );

      // Add/update active session
      setActiveSessions((prev) => ({
        ...prev,
        [tableId]: {
          startTime: prev[tableId]?.startTime || nowTime,
          duration: paymentData.tableRentalInfo?.sessionHours
            ? `${paymentData.tableRentalInfo.sessionHours} Jam`
            : prev[tableId]?.duration || '1 Jam',
          isPending,
        },
      }));

      // If already paid before play, clear the current checkout cart
      if (!isPending) {
        setTableCarts((prev) => ({ ...prev, [tableId]: [] }));
      }
    } else {
      // Free the table (statusId: 1, Kosong)
      setTables((prev) =>
        prev.map((t) =>
          String(t.id) === tableId
            ? { ...t, statusId: 1, status: 'Kosong' }
            : t
        )
      );

      setActiveSessions((prev) => {
        const next = { ...prev };
        delete next[tableId];
        return next;
      });

      setTableCarts((prev) => ({ ...prev, [tableId]: [] }));
    }

    setIsPaymentModalOpen(false);
  };

  // Calculated overall bill for Split Bill Modal including table price
  const activeTableRentalRate =
    Number(selectedTable?.price) ||
    Number(selectedTable?.price_table) ||
    (selectedTable?.category === 'VVIP' ? 55000 : selectedTable?.category === 'VIP' ? 40000 : 35000);
  const activeHours = parseInt(activeSessions[activeTableId]?.duration, 10) || 1;
  const activeRentalTotal = activeTableRentalRate * activeHours;
  const activeFoodSubtotal = currentCart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );
  const combinedSubtotal = activeFoodSubtotal + activeRentalTotal;
  const fullTotalWithTableRental =
    combinedSubtotal + (combinedSubtotal > 0 ? Math.round(combinedSubtotal * 0.04) : 0);

  return (
    <div className="cashier-pos-root">
      {/* Top POS Navigation Bar */}
      <CashierHeader user={user} onLogout={onLogout} />

      {/* Main 3-Column POS Workspace */}
      <div className="cashier-workspace">
        {/* Column 1: Billiard Tables Status */}
        <TableStatusColumn
          tables={tables}
          selectedTableId={activeTableId}
          onSelectTable={handleSelectTable}
          activeSessions={activeSessions}
        />

        {/* Column 2: Menu & Packages Catalog */}
        <MenuCatalogColumn
          foods={foods}
          foodTypes={foodTypes}
          onAddToCart={handleAddToCart}
        />

        {/* Column 3: Order Summary & Cart */}
        <OrderSummaryColumn
          selectedTable={selectedTable}
          activeSession={activeSessions[activeTableId]}
          cartItems={currentCart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onOpenSplitBill={() => setIsSplitBillModalOpen(true)}
          onPayNow={handlePayNow}
          selectedPaymentMethod={selectedPaymentMethod}
          onSelectPaymentMethod={handleSelectQuickPaymentMethod}
          onToggleTableStatus={handleToggleTableStatus}
        />
      </div>

      {/* Payment Processing & Receipt Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={paymentTotal}
        tableName={selectedTable?.name || 'Meja'}
        cartItems={currentCart}
        tableRentalInfo={paymentTableRental}
        initialMethod={selectedPaymentMethod}
        onCompletePayment={handleCompletePayment}
      />

      {/* Split Bill Modal (Includes Table Price!) */}
      <SplitBillModal
        isOpen={isSplitBillModalOpen}
        onClose={() => setIsSplitBillModalOpen(false)}
        totalAmount={paymentTotal > 0 ? paymentTotal : fullTotalWithTableRental}
        tableName={selectedTable?.name || 'Meja'}
        onProceedWithSplitAmount={(splitAmount) => {
          setPaymentTotal(splitAmount);
          setIsPaymentModalOpen(true);
        }}
      />
    </div>
  );
}