import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/'); // Redirect non-admin users to the homepage
    }
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        <p>Welcome, Admin! Here are your management options:</p>
        <ul>
          <li>
            <Link to="/create-pet">Create a New Pet</Link>
          </li>
          <li>
            <Link to="/pets">View All Pets</Link>
          </li>
          <li>
            <Link to="/apply">Manage Applications</Link>
          </li>
          <li>
            <Link to="/admin/shelters">Manage Shelters</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;