import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel';

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check the user's role from localStorage
    const role = localStorage.getItem('role');
    // Redirect non-admin users to the homepage
    if (role !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="admin-dashboard-page">
      {/* Include the AdminPanel component for the admin navbar and header */}
      <AdminPanel />
      <div className="card admin-dashboard">
        {/* Admin welcome message */}
        <h2>Welcome, Admin!</h2>
        <p>Here are your management options:</p>
        <ul className="admin-dashboard__links">
          {/* Links to various admin management pages */}
          <li>
            <Link to="/create-pet">Create a New Pet</Link>
          </li>
          <li>
            <Link to="/admin-view-pets">View All Pets</Link>
          </li>
          <li>
            <Link to="/admin/shelters">Manage Shelters</Link>
          </li>
          <li>
            <Link to="/apply">Manage Applications</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;