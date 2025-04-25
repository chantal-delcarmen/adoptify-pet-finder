import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutPage() {
    const navigate = useNavigate(); // Initialize navigation

    useEffect(() => {
        // Clear user-related data from localStorage
        localStorage.removeItem('access'); // Remove the access token
        localStorage.removeItem('refresh'); // Remove the refresh token
        localStorage.removeItem('role'); // Remove the user's role
        localStorage.removeItem('username'); // Remove the username

        // Redirect to the home page after 2 seconds
        const timer = setTimeout(() => {
            navigate('/'); // Navigate to the home page
        }, 2000);

        // Cleanup the timer when the component unmounts
        return () => clearTimeout(timer); // Clear the timeout to prevent memory leaks
    }, [navigate]); // Dependency array ensures the effect runs when `navigate` changes

    return (
        <div className="logout-page">
            <h1>You have been logged out successfully!</h1> {/* Logout confirmation message */}
            <p>Redirecting to the home page...</p> {/* Inform the user about the redirection */}
        </div>
    );
}

export default LogoutPage; // Export the LogoutPage component