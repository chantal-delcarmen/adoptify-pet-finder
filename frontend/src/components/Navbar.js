import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for client-side navigation
import LogoutLink from './LogoutLink'; // Import the Logout component

function Navbar() {
    const username = localStorage.getItem('username'); // Assume username is stored in localStorage
    const userRole = localStorage.getItem('role'); // Assume role is stored in localStorage

    return (
        <nav className="navbar">
            <div className="navbar__auth">
                <Link to="/">Home</Link>
                <Link to="/pets">Adopt a Pet</Link>
                {username ? (
                    <>
                        <span>Welcome, {username}!</span>
                        <Link to="/profile">Profile</Link>
                        <LogoutLink /> {/* Use the Logout component */}
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;