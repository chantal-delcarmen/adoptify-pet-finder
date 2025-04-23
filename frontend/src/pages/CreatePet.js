import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel';
import PetForm from '../components/PetForm';
import { refreshAccessToken } from '../utils/AuthUtils';

function CreatePet() {
  const [shelters, setShelters] = useState([]); // State to store the list of shelters
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('role'); // Assume role is stored in localStorage
    if (userRole !== 'admin') {
      navigate('/'); // Redirect non-admin users to the home page
    }

    // Fetch the list of shelters
    const fetchShelters = async () => {
      const token = localStorage.getItem('access'); // Use 'access' to get token
      console.log('Token:', token); // Verify the token is being retrieved
      try {
        const response = await fetch('http://localhost:8000/api/admin/shelters/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Include token for authentication
          },
        });
        if (response.ok) {
          const data = await response.json();
          const formattedShelters = data.map((shelter) => ({
            id: shelter.shelter_id,
            name: shelter.name,
          }));
          setShelters(formattedShelters);
        } else {
          console.error('Failed to fetch shelters');
        }
      } catch (err) {
        console.error('Error fetching shelters:', err);
      }
    };

    fetchShelters();
  }, [navigate]);

  const handleCreatePet = async (formData) => {
    const token = localStorage.getItem('access');
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    const response = await fetch('http://localhost:8000/api/register-pet/', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formDataToSend,
    });

    if (!response.ok) {
      throw new Error('Failed to create pet');
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