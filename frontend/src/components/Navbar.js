import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for client-side navigation

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar__auth">
                <Link to="/" className="button button--secondary">Home</Link>
                <Link to="/pets" className="button button--secondary">Pets</Link>
                <Link to="/login" className="button button--secondary">Login</Link>
                <Link to="/signup" className="button button--secondary">Signup</Link>
                <Link to="/apply" className="button button--secondary">Apply</Link>
            </div>
        </nav>
    );
}

export default Navbar;