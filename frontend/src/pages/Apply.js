import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import the Navbar component

function Apply() {
  const [searchParams] = useSearchParams();
  const petId = searchParams.get('petId'); // Get the pet ID from the query parameters
  const [userInfo, setUserInfo] = useState(null); // State for user information
  const [message, setMessage] = useState(''); // State for the adoption message
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('access'); // Retrieve the user's token from localStorage
      if (!token) {
        alert('You must be logged in to submit an application.'); // Alert if the user is not logged in
        navigate('/login'); // Redirect to the login page
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/user/details/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        });

        if (response.ok) {
          const data = await response.json(); // Parse the response JSON
          setUserInfo(data); // Set the user information in state
        } else {
          console.error('Failed to fetch user information'); // Log an error if the request fails
          setError('Failed to load user information. Please try again.'); // Set an error message
        }
      } catch (err) {
        console.error('Error fetching user information:', err); // Log any errors during the fetch process
        setError('An error occurred. Please try again.'); // Set a generic error message
      }
    };

    fetchUserInfo(); // Fetch the user information when the component mounts
  }, [navigate]); // Dependency array ensures the effect runs when `navigate` changes

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const token = localStorage.getItem('access'); // Retrieve the user's token from localStorage
      if (!token) {
        alert('You must be logged in to submit an application.'); // Alert if the user is not logged in
        navigate('/login'); // Redirect to the login page
        return;
      }

      const payload = {
        pet_id: parseInt(petId, 10), // Convert the pet ID to an integer
        message: message, // Include the adoption message
      };

      console.log('Submitting payload:', payload); // Log the payload for debugging

      const response = await fetch('http://localhost:8000/api/adoption-application/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify the content type as JSON
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
        body: JSON.stringify(payload), // Convert the payload to a JSON string
      });

      if (response.ok) {
        const data = await response.json(); // Parse the response JSON
        console.log('Application submitted successfully:', data); // Log the success response
        alert('Your application has been submitted successfully!'); // Show a success alert
        navigate('/profile'); // Redirect to the profile page
      } else {
        const errorData = await response.json(); // Parse the error response JSON
        console.error('Error response from backend:', errorData); // Log the error response

        // Handle specific error cases
        if (errorData.pet_id && errorData.pet_id[0] === 'This pet is not available for adoption.') {
          alert('Sorry, this pet is no longer available for adoption.'); // Alert if the pet is unavailable
        } else {
          alert(errorData.error || 'Failed to submit application'); // Show a generic error alert
        }

        setError(errorData.error || 'Failed to submit application'); // Set the error message in state
        navigate('/pets'); // Redirect to the pets page after failure
      }
    } catch (err) {
      console.error('Error submitting application:', err); // Log any errors during the submission process
      setError('An error occurred. Please try again.'); // Set a generic error message
      navigate('/pets'); // Redirect to the pets page after failure
    }
  };

  return (
    <div>
      {/* Navbar Component */}
      <Navbar />

      <div className="form-page">
        <h1>Adoption Application</h1>
        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="petId">Pet ID:</label>
          <input type="text" id="petId" value={petId} readOnly /> {/* Display the pet ID as read-only */}

          {userInfo && (
            <>
              {/* Display user information as read-only fields */}
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" value={userInfo.username} readOnly />

              <label htmlFor="firstName">First Name:</label>
              <input type="text" id="firstName" value={userInfo.first_name} readOnly />

              <label htmlFor="lastName">Last Name:</label>
              <input type="text" id="lastName" value={userInfo.last_name} readOnly />

              <label htmlFor="email">Email:</label>
              <input type="email" id="email" value={userInfo.email} readOnly />

              <label htmlFor="phone">Phone Number:</label>
              <input type="text" id="phone" value={userInfo.phone_number} readOnly />

              <label htmlFor="address">Address:</label>
              <input type="text" id="address" value={userInfo.address} readOnly />

              <label htmlFor="submissionDate">Submission Date:</label>
              <input
                type="text"
                id="submissionDate"
                value={new Date().toLocaleDateString()} // Auto-filled with the current date
                readOnly
              />
            </>
          )}

          <label htmlFor="message">Why do you want to adopt this pet?</label>
          <textarea
            id="message"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)} // Update the message state on change
            required
          ></textarea>

          <button type="submit" className="button button--primary">Submit Application</button> {/* Submit button */}
        </form>

        {error && <p className="error-message">{error}</p>} {/* Display error message if any */}
      </div>
    </div>
  );
}

export default Apply;