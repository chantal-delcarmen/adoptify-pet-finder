import React from 'react';
import { Link } from 'react-router-dom';

function AdminLayout({ children }) {
  return (
    <div className="content"> {/* Reuse the global content class */}
      <header className="hero"> {/* Reuse the global hero class */}
        <h1>Admin Panel</h1>
        <nav className="admin-navbar__auth"> {/* Use a unique class for admin links */}
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