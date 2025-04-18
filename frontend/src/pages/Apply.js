import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Apply() {
  const [petId, setPetId] = useState('');
  const [applicationStatus, setApplicationStatus] = useState(false); // Default to false
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/application/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pet_id: petId,
          application_status: applicationStatus,
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
    <div className="form-page">
      <h1>Adoption Application</h1>
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="petId">Pet ID:</label>
        <input
          type="text"
          id="petId"
          value={petId}
          onChange={(e) => setPetId(e.target.value)}
          required
        />

        <label htmlFor="applicationStatus">Application Status:</label>
        <select
          id="applicationStatus"
          value={applicationStatus}
          onChange={(e) => setApplicationStatus(e.target.value === 'true')}
        >
          <option value="false">Pending</option>
          <option value="true">Approved</option>
        </select>

        <button type="submit" className="button button--primary">Submit Application</button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Apply;