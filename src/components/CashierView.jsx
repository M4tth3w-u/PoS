import React from 'react';

export default function CashierView({ user }) {
  return (
    <main className="role-view">
      <p>View Cashier</p>
      <span>{user?.username}</span>
    </main>
  );
}