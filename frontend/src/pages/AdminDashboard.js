import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/'); // Redirect non-admin users to the homepage
    }
  }, [navigate]);

  return (
    <AdminLayout>
      <h1>Welcome, Admin!</h1>
      <p>Here are your management options:</p>
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
    </AdminLayout>
  );
}

export default AdminDashboard;