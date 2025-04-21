import React, { useState } from 'react'; // Import React and useState for state management
import { useNavigate } from 'react-router-dom'; // Use react-router-dom for navigation
import Navbar from '../components/Navbar'; // Import Navbar component

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('username', username); // Store the username in localStorage

        // Fetch user details
        const userResponse = await fetch('http://localhost:8000/api/user/details/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.access}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          localStorage.setItem('role', userData.role); // Store the role in localStorage

          // Redirect based on role
          if (userData.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/');
          }
        } else {
          const errorData = await userResponse.json();
          console.error('User details error:', errorData);
          setError('Failed to fetch user details.');
        }
      } else {
        const errorData = await response.json();
        console.error('Login error:', errorData);
        setError(errorData.detail || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navbar Component */}
      <Navbar />

      <div className="form-page">
        <h1>Login</h1>
        <form onSubmit={handleLogin} className="form">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="button button--primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Display error message */}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;