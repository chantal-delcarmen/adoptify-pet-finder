import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/user/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          address,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Signup successful:', data);
        navigate('/login'); // Redirect to login page after successful signup
      } else {
        const errorData = await response.json();
        console.error('Backend error:', errorData); // Log the backend error

        // Extract and format error messages
        const errorMessage =
          errorData.detail || // General error
          Object.entries(errorData) // Validation errors
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join(' ') || 
          'Signup failed';

        setError(errorMessage); // Display the error message
      }
    } catch (err) {
      console.error('Error signing up:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
    {/* Navbar Component */}
    <Navbar />
      <div className="form-page">
        <h1>Signup</h1>
        <form onSubmit={handleSignup} className="form">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

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

          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />

          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <button type="submit" className="button button--primary">Signup</button>
        </form>

        {/* Display error message */}
        {error && <p className="error-message">{error}</p>}
      </div>
     </div> 
  );
}

export default Signup;