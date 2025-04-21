import React from 'react';
import { Link } from 'react-router-dom';

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <nav>
          <Link to="/admin-dashboard">Dashboard</Link>
          <Link to="/create-pet">Create Pet</Link>
          <Link to="/admin/shelters">Manage Shelters</Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default AdminLayout;