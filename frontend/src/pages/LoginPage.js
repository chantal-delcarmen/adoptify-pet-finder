import React, { useState } from 'react'; // Import React and useState for state management
import { useNavigate } from 'react-router-dom'; // Use react-router-dom for navigation
import Navbar from '../components/Navbar'; // Import Navbar component

function LoginPage() {
  const [username, setUsername] = useState(''); // State for storing the username input
  const [password, setPassword] = useState(''); // State for storing the password input
  const [error, setError] = useState(''); // State for storing error messages
  const [loading, setLoading] = useState(false); // State for tracking the loading status
  const navigate = useNavigate(); // Initialize navigation

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setLoading(true); // Set loading to true while processing the login
    setError(''); // Clear any previous error messages

    try {
      // Send a POST request to the login endpoint
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Specify the content type as JSON
        body: JSON.stringify({ username, password }), // Send the username and password as the request body
      });

      if (response.ok) {
        const data = await response.json(); // Parse the response JSON
        localStorage.setItem('access', data.access); // Store the access token in localStorage
        localStorage.setItem('refresh', data.refresh); // Store the refresh token in localStorage
        localStorage.setItem('username', username); // Store the username in localStorage

        // Fetch user details after successful login
        const userResponse = await fetch('http://localhost:8000/api/user/details/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json', // Specify the content type as JSON
            Authorization: `Bearer ${data.access}`, // Include the access token for authentication
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json(); // Parse the user details response JSON
          localStorage.setItem('role', userData.role); // Store the user's role in localStorage

          // Redirect the user based on their role
          if (userData.role === 'admin') {
            navigate('/admin-dashboard'); // Redirect to the admin dashboard for admin users
          } else {
            navigate('/'); // Redirect to the homepage for regular users
          }
        } else {
          const errorData = await userResponse.json(); // Parse the error response JSON
          console.error('User details error:', errorData); // Log the error response
          setError('Failed to fetch user details.'); // Set an error message
        }
      } else {
        const errorData = await response.json(); // Parse the error response JSON
        console.error('Login error:', errorData); // Log the error response
        setError(errorData.detail || 'Invalid username or password'); // Set an error message
      }
    } catch (err) {
      console.error('Network error:', err); // Log any network errors
      setError('An error occurred. Please try again.'); // Set a generic error message
    } finally {
      setLoading(false); // Set loading to false after processing is complete
    }
  };

  return (
    <div>
      {/* Navbar Component */}
      <Navbar /> {/* Render the Navbar component */}

      <div className="form-page">
        <h1>Login</h1> {/* Page heading */}
        <form onSubmit={handleLogin} className="form">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username} // Bind the username state to the input value
            onChange={(e) => setUsername(e.target.value)} // Update the username state on input change
            required // Make the input field required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password} // Bind the password state to the input value
            onChange={(e) => setPassword(e.target.value)} // Update the password state on input change
            required // Make the input field required
          />

          <button type="submit" className="button button--primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'} {/* Show loading text while processing */}
          </button>
        </form>

        {/* Display error message */}
        {error && <p className="error-message">{error}</p>} {/* Render the error message if any */}
      </div>
    </div>
  );
}

export default LoginPage; // Export the LoginPage component