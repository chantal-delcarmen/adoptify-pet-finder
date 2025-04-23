// Create page for updating pet details
import React, { useEffect, useState } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel'; // Import the AdminPanel for the navbar and header



function AdminUpdatePet() {
  const [pet, setPet] = useState(null); // State for the pet details
  const [error, setError] = useState(''); // State for error messages
  const [loading, setLoading] = useState(true); // State for loading status
  const navigate = useNavigate(); // Initialize navigation
  const { petId } = useParams(); // Get the pet ID from the URL parameters

  useEffect(() => {
    const fetchPetDetails = async () => {
      const token = localStorage.getItem('access'); // Get the admin token
      try {
        const response = await fetch(`http://localhost:8000/api/pets/${petId}/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Include token for authentication
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPet(data); // Set the pet details in state
        } else {
          setError('Failed to fetch pet details');
        }
      } catch (err) {
        setError('An error occurred while fetching pet details');
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchPetDetails();
  }, [petId]); // Fetch pet details when the component mounts or when petId changes

  const handleUpdateClick = async () => {
    const token = localStorage.getItem('access'); // Get the admin token
    try {
      const response = await fetch(`http://localhost:8000/api/pets/${petId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
        body: JSON.stringify(pet), // Send updated pet details in the request body
      });
      if (response.ok) {
        navigate('/admin-view-pets'); // Redirect to the pets list page after successful update
      } else {
        setError('Failed to update pet details');
      }
    } catch (err) {
      setError('An error occurred while updating pet details');
    }
  };

  if (loading) return <div>Loading...</div>; // Show loading message while fetching data

  return (
    <div className="admin-update-pet-page">
      <AdminPanel />