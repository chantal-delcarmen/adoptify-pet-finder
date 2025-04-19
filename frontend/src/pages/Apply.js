import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import the Navbar component

function Apply() {
  const [searchParams] = useSearchParams();
  const petId = searchParams.get('petId');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/adoption-application/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pet_id: petId,
          adopter_name: name,
          adopter_email: email,
          message: message,
          application_status: 'Pending',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Application submitted successfully:', data);
        navigate('/'); // Redirect to the homepage or confirmation page
      } else {
        const errorData = await response.json();
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

          <label htmlFor="name">Your Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="email">Your Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

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