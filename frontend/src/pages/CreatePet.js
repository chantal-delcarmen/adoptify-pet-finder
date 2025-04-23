import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel';
import PetForm from '../components/PetForm';
import { fetchShelters } from '../utils/FetchShelters'; // Import the fetchShelters utility
import { refreshAccessToken } from '../utils/AuthUtils'; // Import the token refresh utility

function CreatePet() {
  const [shelters, setShelters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (userRole !== 'admin') {
      navigate('/'); // Redirect non-admin users to the home page
    }

    const fetchSheltersData = async () => {
      let token = localStorage.getItem('access');

      // Refresh the token if necessary
      if (!token) {
        token = await refreshAccessToken(); // Use the AuthUtils function to refresh the token
        if (!token) {
          console.error('Failed to refresh token');
          navigate('/login'); // Redirect to login if token refresh fails
          return;
        }
      }

      // Fetch shelters using the utility
      const sheltersData = await fetchShelters(token);
      setShelters(sheltersData);
    };

    fetchSheltersData();
  }, [navigate]);

  const handleCreatePet = async (formData) => {
    let token = localStorage.getItem('access');

    // Refresh the token if necessary
    if (!token) {
      token = await refreshAccessToken();
      if (!token) {
        console.error('Failed to refresh token');
        navigate('/login');
        return;
      }
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'image' && !formData.image) {
        return; // Skip the image field if no new image is selected
      }
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch('http://localhost:8000/api/register-pet/', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.detail || 'Failed to create pet');
      }

      alert('Pet created successfully!');
      navigate('/admin-view-pets');
    } catch (error) {
      console.error('Error creating pet:', error);
      alert(error.message || 'An error occurred while creating the pet.');
    }
  };

  return (
    <div>
      <AdminPanel />
      <h1>Create a New Pet</h1>
      <PetForm initialData={null} onSubmit={handleCreatePet} shelters={shelters} />
    </div>
  );
}

export default CreatePet;