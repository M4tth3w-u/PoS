import React, { useState, useEffect } from 'react';
import './Admin.css';
import AdminSidebar from './admin/AdminSidebar';
import AdminBottomNav from './admin/AdminBottomNav';
import AdminHeader from './admin/AdminHeader';
import OverviewTab from './admin/OverviewTab';
import FoodManagementTab from './admin/FoodManagementTab';
import AccountManagementTab from './admin/AccountManagementTab';
import ResupplyModal from './admin/ResupplyModal';
import FoodFormModal from './admin/FoodFormModal';
import AccountFormModal from './admin/AccountFormModal';

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
        const response = await fetch('/admin/user', {
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
      localStorage.setItem('pos_accounts', JSON.stringify(accounts));
    } catch (err) {
      console.error('Failed to persist accounts', err);
    }
  }, [accounts]);

  // Modal States
  const [resupplyItem, setResupplyItem] = useState(null);
  const [foodModal, setFoodModal] = useState({ isOpen: false, item: null });
  const [accountModal, setAccountModal] = useState({ isOpen: false, account: null });

  // Stock Resupply Handler
  const handleConfirmResupply = (foodId, addQuantity) => {
    setFoods((prev) =>
      prev.map((f) => (f.id === foodId ? { ...f, stock: f.stock + addQuantity } : f))
    );
    setResupplyItem(null);
  };

  // Food CRUD Handlers
  const handleSaveFood = (itemData) => {
    setFoods((prev) => {
      const exists = prev.some((f) => f.id === itemData.id);
      if (exists) {
        return prev.map((f) => (f.id === itemData.id ? itemData : f));
      }
      return [itemData, ...prev];
    });
    setFoodModal({ isOpen: false, item: null });
  };

  const handleDeleteFood = (foodId) => {
    if (window.confirm('Are you sure you want to remove this menu item?')) {
      setFoods((prev) => prev.filter((f) => f.id !== foodId));
    }
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

      const response = await fetch('/admin/users/save', {
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
    } catch (error) {
      setAccountsError(error.message || 'Gagal menyimpan akun.');
      setAccountsLoading(false);
    }
  };

  const handleDeleteAccount = async (accId) => {
    if (!window.confirm('Are you sure you want to delete this staff account?')) {
      return;
    }

    setAccountsLoading(true);
    setAccountsError('');

    try {
      const response = await fetch('/admin/users/delete', {
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
    } catch (error) {
      setAccountsError(error.message || 'Gagal menghapus akun.');
      setAccountsLoading(false);
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
              onOpenResupply={setResupplyItem}
              onNavigateTab={setActiveTab}
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
    </div>
  );
}