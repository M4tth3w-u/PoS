import React from 'react';

export default function AdminHeader({ activeTab }) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Dashboard & Operations';
      case 'tables':
        return 'Billiard Tables Management';
      case 'food':
        return 'Food Availability Management';
      case 'accounts':
        return 'Account & Staff Management';
      default:
        return 'Admin Console';
    }
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <h1 className="header-page-title">{getTabTitle()}</h1>
      </div>
    </header>
  );
}
