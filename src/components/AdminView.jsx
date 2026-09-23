import React from 'react';

export default function AdminView({ user }) {
  return (
    <main className="role-view">
      <p>View Admin</p>
      <span>{user?.username}</span>
    </main>
  );
}