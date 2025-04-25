import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import the Navbar component

function Signup() {
  const [username, setUsername] = useState(''); // State for storing the username input
  const [email, setEmail] = useState(''); // State for storing the email input
  const [password, setPassword] = useState(''); // State for storing the password input
  const [firstName, setFirstName] = useState(''); // State for storing the first name input
  const [lastName, setLastName] = useState(''); // State for storing the last name input
  const [phoneNumber, setPhoneNumber] = useState(''); // State for storing the phone number input
  const [address, setAddress] = useState(''); // State for storing the address input
  const [error, setError] = useState(''); // State for storing error messages
  const navigate = useNavigate(); // Initialize navigation

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      // Send a POST request to the signup endpoint
      const response = await fetch('http://localhost:8000/api/user/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Specify the content type as JSON
        body: JSON.stringify({
          username,
          email,
          password,
          first_name: firstName, // Map firstName to the backend field
          last_name: lastName, // Map lastName to the backend field
          phone_number: phoneNumber, // Map phoneNumber to the backend field
          address,
        }),
      });

      if (response.ok) {
        const data = await response.json(); // Parse the response JSON
        console.log('Signup successful:', data); // Log the success response
        navigate('/login'); // Redirect to the login page after successful signup
      } else {
        const errorData = await response.json(); // Parse the error response JSON
        console.error('Backend error:', errorData); // Log the backend error

        // Extract and format error messages
        const errorMessage =
          errorData.detail || // General error
          Object.entries(errorData) // Validation errors
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`) // Format field-specific errors
            .join(' ') || 
          'Signup failed'; // Fallback error message

        setError(errorMessage); // Display the error message
      }
    } catch (err) {
      console.error('Error signing up:', err); // Log any network or unexpected errors
      setError('An error occurred. Please try again.'); // Set a generic error message
    }
  };

  return (
    <div>
      {/* Navbar Component */}
      <Navbar /> {/* Render the Navbar component */}
      <div className="form-page">
        <h1>Sign Up</h1> {/* Page heading */}
        <form onSubmit={handleSignup} className="form">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username} // Bind the username state to the input value
            onChange={(e) => setUsername(e.target.value)} // Update the username state on input change
            required // Make the input field required
          />

          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName} // Bind the firstName state to the input value
            onChange={(e) => setFirstName(e.target.value)} // Update the firstName state on input change
            required // Make the input field required
          />

          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName} // Bind the lastName state to the input value
            onChange={(e) => setLastName(e.target.value)} // Update the lastName state on input change
            required // Make the input field required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email} // Bind the email state to the input value
            onChange={(e) => setEmail(e.target.value)} // Update the email state on input change
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

          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber} // Bind the phoneNumber state to the input value
            onChange={(e) => setPhoneNumber(e.target.value)} // Update the phoneNumber state on input change
            required // Make the input field required
          />

          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            value={address} // Bind the address state to the input value
            onChange={(e) => setAddress(e.target.value)} // Update the address state on input change
            required // Make the input field required
          />

          <button type="submit" className="button button--primary">Signup</button> {/* Submit button */}
        </form>

        {/* Display error message */}
        {error && <p className="error-message">{error}</p>} {/* Render the error message if any */}
      </div>
    </div>
  );
}

export default Signup; // Export the Signup component