import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutPage() {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear user-related data from localStorage
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('role');
        localStorage.removeItem('username');

        // Redirect to the home page after 2 seconds
        const timer = setTimeout(() => {
            navigate('/');
        }, 2000);

        // Cleanup the timer when the component unmounts
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="logout-page">
            <h1>You have been logged out successfully!</h1>
            <p>Redirecting to the home page...</p>
        </div>
    );
}

export default LogoutPage;