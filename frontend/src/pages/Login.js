import React, { useState } from 'react'; // Import React and useState for state management
import { useNavigate } from 'react-router-dom'; // Use react-router-dom for navigation

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState(''); // State for debugging output
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api-auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        setDebugInfo(`Login successful: ${JSON.stringify(data, null, 2)}`);
        localStorage.setItem('token', data.token);
        navigate('/'); // Redirect to the homepage or dashboard
      } else {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        setError(errorData.error || 'Login failed');
        setDebugInfo(`Backend error: ${JSON.stringify(errorData, null, 2)}`);
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('An error occurred. Please try again.');
      setDebugInfo(`Error logging in: ${err.message}`);
    }
  };

  return (
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

        <button type="submit" className="button button--primary">Login</button>
      </form>

      {/* Display error message */}
      {error && <p className="error-message">{error}</p>}

      {/* Display debugging information */}
      {debugInfo && (
        <div className="debug-info">
          <h3>Debug Info:</h3>
          <pre>{debugInfo}</pre>
        </div>
      )}
    </div>
  );
}

export default Login;