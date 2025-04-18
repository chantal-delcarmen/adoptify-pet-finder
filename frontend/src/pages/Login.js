import React, { useState } from 'react'; // Import React and useState for state management
import { useNavigate } from 'react-router-dom'; // Use react-router-dom for navigation
import '../styles/login.scss'; // Import login styles 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api-auth//login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        // Save token or user data to localStorage or context
        localStorage.setItem('token', data.token);
        navigate('/'); // Redirect to the homepage or dashboard
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Login failed');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="login-form">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        <button type="submit" className="button button--primary">Login</button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Login;