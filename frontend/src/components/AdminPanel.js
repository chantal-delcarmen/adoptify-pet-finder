import React from 'react';
import { Link } from 'react-router-dom';
import LogoutLink from './LogoutLink'; // Import the Logout component

function AdminPanel() {
  return (
    <div className="content"> {/* Reuse the global content class */}
      <header className="hero admin-hero"> {/* Add a unique class for admin styling */}
        <h1 className="hero__title admin-hero__title">ADMIN PANEL</h1> {/* Uppercase header with white font */}
        <nav className="admin-navbar"> {/* Admin-specific navbar */}
          <Link className="admin-navbar__link" to="/admin-dashboard">Dashboard</Link>
          <Link className="admin-navbar__link" to="/create-pet">Create Pet</Link>
          <Link className="admin-navbar__link" to="/admin-view-pets">View All Pets</Link>
          <Link className="admin-navbar__link" to="/admin/shelters">Manage Shelters</Link>
          <Link className="admin-navbar__link" to="/admin/applications">Manage Applications</Link>
          <LogoutLink className="admin-navbar__link" />
        </nav>
      </header>
    </div>
  );
}

export default AdminPanel;