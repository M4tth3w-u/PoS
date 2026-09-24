import React, { useState, useEffect } from 'react';
import './Admin.css';
import AdminSidebar from './admin/AdminSidebar';
import AdminBottomNav from './admin/AdminBottomNav';
import AdminHeader from './admin/AdminHeader';
import OverviewTab from './admin/OverviewTab';
import TableManagementTab from './admin/TableManagementTab';
import FoodManagementTab from './admin/FoodManagementTab';
import AccountManagementTab from './admin/AccountManagementTab';
import ResupplyModal from './admin/ResupplyModal';
import FoodFormModal from './admin/FoodFormModal';
import AccountFormModal from './admin/AccountFormModal';
import TableFormModal from './admin/TableFormModal';
import { apiUrl } from '../config/api';
import { confirmDelete, showError, showSuccess } from '../utils/alerts';

const TABLE_CATEGORIES = [
  { value: 1, label: 'Standart' },
  { value: 2, label: 'VIP' },
  { value: 3, label: 'VVIP' },
];

const TABLE_STATUSES = [
  { value: 1, label: 'Ready' },
  { value: 2, label: 'Used' },
  { value: 3, label: 'Maintenance' },
];

export default function AdminView({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Real dataset states (initialized empty for backend team integration)
  const [foods, setFoods] = useState(() => {
    try {
      const saved = localStorage.getItem('pos_foods');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [tables, setTables] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [tablesError, setTablesError] = useState('');
  const [tableCategories, setTableCategories] = useState(TABLE_CATEGORIES);
  const [tableStatuses, setTableStatuses] = useState(TABLE_STATUSES);

  const [accounts, setAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('pos_accounts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState('');

  const loadAccounts = async () => {
      setAccountsLoading(true);
      setAccountsError('');

      try {
        const response = await fetch(apiUrl('/admin/user'), {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
          },
        });
        const responseText = await response.text();
        let responseData = null;

        try {
          responseData = responseText ? JSON.parse(responseText) : null;
        } catch {
          throw new Error('Respons server bukan JSON yang valid.');
        }

        if (!response.ok) {
          throw new Error(responseData?.message || 'Gagal mengambil data akun.');
        }

        const accountList = Array.isArray(responseData)
          ? responseData
          : responseData?.data?.users ||
            responseData?.data ||
            responseData?.users ||
            [];

        if (!Array.isArray(accountList)) {
          throw new Error('Format data akun dari server tidak valid.');
        }

        setAccounts(
          accountList.map((account) => ({
            ...account,
            id: account.id ?? account.id_user,
          }))
        );
      } catch (error) {
        setAccountsError(error.message || 'Gagal mengambil data akun.');
      } finally {
        setAccountsLoading(false);
      }
  };

  useEffect(() => {
    if (activeTab !== 'accounts') return;
    loadAccounts();
  }, [activeTab]);

  // Sync state with local storage for frontend operational persistence
  useEffect(() => {
    try {
      localStorage.setItem('pos_foods', JSON.stringify(foods));
    } catch (err) {
      console.error('Failed to persist foods', err);
    }
  }, [foods]);

  useEffect(() => {
    try {
      localStorage.setItem('pos_tables', JSON.stringify(tables));
    } catch (err) {
      console.error('Failed to persist tables', err);
    }
  }, [tables]);

  useEffect(() => {
    try {
      localStorage.setItem('pos_accounts', JSON.stringify(accounts));
    } catch (err) {
      console.error('Failed to persist accounts', err);
    }
  }, [accounts]);

  // Modal States
  const [resupplyItem, setResupplyItem] = useState(null);
  const [foodModal, setFoodModal] = useState({ isOpen: false, item: null });
  const [accountModal, setAccountModal] = useState({ isOpen: false, account: null });
  const [tableModal, setTableModal] = useState({ isOpen: false, table: null });

  const loadTables = async () => {
    setTablesLoading(true);
    setTablesError('');

    try {
      const requestOptions = {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      };
      const tableResponse = await fetch(apiUrl('/admin/table'), requestOptions);
      const tableText = await tableResponse.text();
      const responseData = tableText ? JSON.parse(tableText) : null;

      if (!tableResponse.ok || responseData?.success === false) {
        throw new Error(responseData?.message || 'Gagal mengambil data meja.');
      }

      const responseTables = responseData?.data;
      const tableList = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseTables)
          ? responseTables
          : responseTables?.tables || [];

      if (!Array.isArray(tableList)) {
        throw new Error('Format data meja dari server tidak valid.');
      }

      const getOptionLabel = (options, value) =>
        options.find((option) => String(option.value) === String(value))?.label || '';

      const normalizedTables = tableList.map((table) => ({
          ...table,
          id: table.id ?? table.id_table ?? table.id_meja,
          categoryId: table.categoryId ?? table.id_category_table ?? table.id_category,
          statusId: table.statusId ?? table.id_status_table ?? table.id_status,
          tableNumber:
            table.tableNumber ??
            table.name_table ??
            table.nama_meja ??
            table.nomor_meja ??
            '',
          type:
            table.nama_category ??
            table.name_category ??
            table.type ??
            table.kategori ??
            table.category ??
            table.jenis ??
            getOptionLabel(
              TABLE_CATEGORIES,
              table.categoryId ?? table.id_category_table ?? table.id_category
            ),
          hourlyRate: Number(
            table.hourlyRate ??
              table.price_table ??
              table.harga_per_jam ??
              0
          ),
          status:
            table.nama_status ||
            table.name_status ||
            table.status_table ||
            table.status_operasional ||
            (typeof table.status === 'string' ? table.status : '') ||
            getOptionLabel(
              TABLE_STATUSES,
              table.statusId ?? table.id_status_table ?? table.id_status
            ),
          location: table.location ?? table.lokasi ?? '',
          specifications: table.specifications ?? table.spesifikasi ?? '',
        }));

      setTables(normalizedTables);
      setTableCategories(TABLE_CATEGORIES);
      setTableStatuses(TABLE_STATUSES);

    } catch (error) {
      setTablesError(error.message || 'Gagal mengambil data meja.');
    } finally {
      setTablesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'tables') loadTables();
  }, [activeTab]);

  // Billiard Table CRUD Handlers
  const handleSaveTable = async (tableData) => {
    setTablesLoading(true);
    setTablesError('');

    try {
      const payload = {
        nama_meja: tableData.tableNumber,
        price_table: Number(tableData.hourlyRate) || 0,
        id_category_table: tableData.categoryId,
        id_status_table: tableData.statusId,
      };

      if (tableData.id) payload.id_meja = tableData.id;

      const response = await fetch(apiUrl('/admin/table/save'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();

      if (!response.ok || responseData?.success === false) {
        throw new Error(responseData?.message || 'Gagal menyimpan data meja.');
      }

      setTableModal({ isOpen: false, table: null });
      await loadTables();
      await showSuccess(
        tableData.id ? 'Data meja berhasil diperbarui.' : 'Data meja berhasil ditambahkan.'
      );
    } catch (error) {
      const message = error.message || 'Gagal menyimpan data meja.';
      setTablesError(message);
      setTablesLoading(false);
      await showError(message);
    }
  };

  const handleDeleteTable = async (tableId) => {
    const confirmation = await confirmDelete('Meja billiard');
    if (!confirmation.isConfirmed) return;

    setTablesLoading(true);
    setTablesError('');

    try {
      const response = await fetch(apiUrl('/admin/table/delete'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ id_meja: tableId, id: tableId }),
      });
      const responseData = await response.json();

      if (!response.ok || responseData?.success === false) {
        throw new Error(responseData?.message || 'Gagal menghapus data meja.');
      }

      await loadTables();
      await showSuccess('Data meja berhasil dihapus.');
    } catch (error) {
      const message = error.message || 'Gagal menghapus data meja.';
      setTablesError(message);
      setTablesLoading(false);
      await showError(message);
    }
  };

  const handleQuickToggleTableStatus = (tableId) => {
    const table = tables.find((item) => item.id === tableId);
    if (!table) return;

    handleSaveTable({
      ...table,
      status: table.status === 'Maintenance' ? 'Ready' : 'Maintenance',
    });
  };

  // Stock Resupply Handler
  const handleConfirmResupply = (foodId, addQuantity) => {
    setFoods((prev) =>
      prev.map((f) => (f.id === foodId ? { ...f, stock: f.stock + addQuantity } : f))
    );
    setResupplyItem(null);
  };

  // Food CRUD Handlers
  const handleSaveFood = (itemData) => {
    const isUpdating = foods.some((food) => food.id === itemData.id);
    setFoods((prev) => {
      if (isUpdating) {
        return prev.map((f) => (f.id === itemData.id ? itemData : f));
      }
      return [itemData, ...prev];
    });
    setFoodModal({ isOpen: false, item: null });
    showSuccess(isUpdating ? 'Menu berhasil diperbarui.' : 'Menu berhasil ditambahkan.');
  };

  const handleDeleteFood = async (foodId) => {
    const confirmation = await confirmDelete('Menu makanan');
    if (!confirmation.isConfirmed) return;

    setFoods((prev) => prev.filter((food) => food.id !== foodId));
    await showSuccess('Menu berhasil dihapus.');
  };

  // Account CRUD Handlers
  const handleSaveAccount = async (accData) => {
    setAccountsLoading(true);
    setAccountsError('');

    try {
      const payload = {
        username: accData.username,
        id_role: accData.id_role,
        status: accData.status,
      };

      if (accData.id) {
        payload.id_user = accData.id;
      }

      if (accData.password) {
        payload.password = accData.password;
      }

      const response = await fetch(apiUrl('/admin/users/save'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();

      if (!response.ok || responseData?.success === false) {
        throw new Error(responseData?.message || 'Gagal menyimpan akun.');
      }

      setAccountModal({ isOpen: false, account: null });
      await loadAccounts();
      await showSuccess(
        accData.id ? 'Akun berhasil diperbarui.' : 'Akun berhasil dibuat.'
      );
    } catch (error) {
      const message = error.message || 'Gagal menyimpan akun.';
      setAccountsError(message);
      setAccountsLoading(false);
      await showError(message);
    }
  };

  const handleDeleteAccount = async (accId) => {
    const confirmation = await confirmDelete('Akun staf');
    if (!confirmation.isConfirmed) return;

    setAccountsLoading(true);
    setAccountsError('');

    try {
      const response = await fetch(apiUrl('/admin/users/delete'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ id_user: accId, id: accId }),
      });
      const responseData = await response.json();

      if (!response.ok || responseData?.success === false) {
        throw new Error(responseData?.message || 'Gagal menghapus akun.');
      }

      await loadAccounts();
      await showSuccess('Akun berhasil dihapus.');
    } catch (error) {
      const message = error.message || 'Gagal menghapus akun.';
      setAccountsError(message);
      setAccountsLoading(false);
      await showError(message);
    }
  };

  const lowStockCount = foods.filter((f) => f.stock <= 5).length;

  return (
    <div className="admin-layout">
      {/* Background Ambient Lighting */}
      <div className="admin-ambient-glow" aria-hidden="true">
        <div className="admin-glow-top" />
        <div className="admin-glow-bottom" />
      </div>

      {/* Sidebar for Desktop & Tablet Icon-Rail */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className="admin-main-viewport">
        <AdminHeader activeTab={activeTab} />

        <main className="admin-content-container">
          {activeTab === 'overview' && (
            <OverviewTab
              foods={foods}
              accounts={accounts}
              tables={tables}
              onOpenResupply={setResupplyItem}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'tables' && (
            <TableManagementTab
              tables={tables}
              isLoading={tablesLoading}
              errorMessage={tablesError}
              tableCategories={tableCategories}
              tableStatuses={tableStatuses}
              onOpenAddModal={() => setTableModal({ isOpen: true, table: null })}
              onOpenEditModal={(table) => setTableModal({ isOpen: true, table })}
              onDeleteTable={handleDeleteTable}
              onQuickToggleStatus={handleQuickToggleTableStatus}
            />
          )}

          {activeTab === 'food' && (
            <FoodManagementTab
              foods={foods}
              onOpenResupply={setResupplyItem}
              onOpenAddModal={() => setFoodModal({ isOpen: true, item: null })}
              onOpenEditModal={(item) => setFoodModal({ isOpen: true, item })}
              onDeleteFood={handleDeleteFood}
            />
          )}

          {activeTab === 'accounts' && (
            <AccountManagementTab
              accounts={accounts}
              isLoading={accountsLoading}
              errorMessage={accountsError}
              onOpenAddModal={() => setAccountModal({ isOpen: true, account: null })}
              onOpenEditModal={(acc) => setAccountModal({ isOpen: true, account: acc })}
              onDeleteAccount={handleDeleteAccount}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (< 768px) */}
      <AdminBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />

      {/* Modal Dialogs */}
      {resupplyItem && (
        <ResupplyModal
          item={resupplyItem}
          onClose={() => setResupplyItem(null)}
          onConfirm={handleConfirmResupply}
        />
      )}

      {foodModal.isOpen && (
        <FoodFormModal
          initialData={foodModal.item}
          onClose={() => setFoodModal({ isOpen: false, item: null })}
          onSave={handleSaveFood}
        />
      )}

      {accountModal.isOpen && (
        <AccountFormModal
          initialData={accountModal.account}
          onClose={() => setAccountModal({ isOpen: false, account: null })}
          onSave={handleSaveAccount}
        />
      )}

      {tableModal.isOpen && (
        <TableFormModal
          initialData={tableModal.table}
          categories={tableCategories}
          statuses={tableStatuses}
          onClose={() => setTableModal({ isOpen: false, table: null })}
          onSave={handleSaveTable}
        />
      )}
    </div>
  );
}