import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import the Navbar component

function Apply() {
  const [searchParams] = useSearchParams();
  const petId = searchParams.get('petId'); // Get the pet ID from the query parameters
  const [userInfo, setUserInfo] = useState(null); // State for user information
  const [message, setMessage] = useState(''); // Message for the application
  const [error, setError] = useState(''); // Error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('access'); // Get the user's token
      if (!token) {
        alert('You must be logged in to submit an application.');
        navigate('/login'); // Redirect to login if not authenticated
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/user/details/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data); // Set the user information
        } else {
          console.error('Failed to fetch user information');
          setError('Failed to load user information. Please try again.');
        }
      } catch (err) {
        console.error('Error fetching user information:', err);
        setError('An error occurred. Please try again.');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('access'); // Get the user's token
        if (!token) {
            alert('You must be logged in to submit an application.');
            navigate('/login'); // Redirect to login if not authenticated
            return;
        }

        const payload = {
            pet_id: parseInt(petId, 10), // Convert petId to an integer
            message: message,
        };

        console.log("Submitting payload:", payload); // Log the payload

        const response = await fetch('http://localhost:8000/api/adoption-application/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Include the token in the request
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Application submitted successfully:', data);
            alert('Your application has been submitted successfully!');
            navigate('/'); // Redirect to the homepage or confirmation page
        } else {
            const errorData = await response.json();
            console.error('Error response from backend:', errorData);
            setError(errorData.error || 'Failed to submit application');
        }
    } catch (err) {
        console.error('Error submitting application:', err);
        setError('An error occurred. Please try again.');
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
          <input type="text" id="petId" value={petId} readOnly />

          {userInfo && (
            <>
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
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>

          <button type="submit" className="button button--primary">Submit Application</button>
        </form>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default Apply;