import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for client-side navigation

function Navbar() {
    const userRole = localStorage.getItem('role'); // Assume role is stored in localStorage

    return (
        <nav className="navbar">
            <div className="navbar__auth">
                <Link to="/">Home</Link>
                <Link to="/pets">Pets</Link>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
                <Link to="/apply">Apply</Link>
                
                {/* Conditionally render the Create Pet link for admins */}
                {userRole === 'admin' && (
                    <Link to="/create-pet">Create Pet</Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;