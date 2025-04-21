import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user-related data from localStorage
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        navigate('/logout'); // Redirect to the logout page
    };

    return (
        <Link to="/logout" onClick={handleLogout} className="logout-link">
            Logout
        </Link>
    );
}

export default Logout;