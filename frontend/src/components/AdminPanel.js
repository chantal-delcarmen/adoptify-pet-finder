import React from 'react';
import { Link } from 'react-router-dom';

function AdminPanel() {
  return (
    <div className="content"> {/* Reuse the global content class */}
      <header className="hero admin-hero"> {/* Add a unique class for admin styling */}
        <h1>Admin Panel</h1>
        <nav className="admin-navbar__auth"> {/* Admin-specific navbar */}
          <Link to="/admin-dashboard">Dashboard</Link>
          <Link to="/create-pet">Create Pet</Link>
          <Link to="/pets">View All Pets</Link>
          <Link to="/admin/shelters">Manage Shelters</Link>
          <Link to="/admin/applications">Manage Applications</Link>
        </nav>
      </header>
    </div>
  );
}

export default AdminPanel;