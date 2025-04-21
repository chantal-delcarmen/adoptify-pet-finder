import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import AdminPanel from '../components/AdminPanel';

function AdminViewPets() {
  const [pets, setPets] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const fetchPets = async () => {
      const token = localStorage.getItem('access'); // Get the admin token
      try {
        const response = await fetch('http://localhost:8000/api/pets/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Include token for authentication
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPets(data);
        } else {
          setError('Failed to fetch pets');
        }
      } catch (err) {
        setError('An error occurred while fetching pets');
      }
    };

    fetchPets();
  }, []);

  const handleEditClick = (petId) => {
    // Navigate to the edit pet page with the pet ID as a query parameter
    navigate(`/edit-pet?petId=${petId}`);
  };

  const handleDeleteClick = async (petId) => {
    const token = localStorage.getItem('access'); // Get the admin token
    try {
      const response = await fetch(`http://localhost:8000/api/pets/${petId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
      });
      if (response.ok) {
        setPets((prevPets) => prevPets.filter((pet) => pet.id !== petId)); // Remove the deleted pet from the list
      } else {
        setError('Failed to delete pet');
      }
    } catch (err) {
      setError('An error occurred while deleting the pet');
    }
  };

  return (
    <div className="admin-pets-page">
      {/* Navbar Component */}
      <AdminPanel />

      {/* Hero Section */}
      <section className="hero">
        <h2>All Pets</h2>
        <p>Manage all pets in the system.</p>
      </section>

      {/* Pets List */}
      <div className="pets-list">
        {error && <p className="error-message">{error}</p>}
        {pets.map((pet) => (
          <div key={pet.id} className="pet-card">
            <img src={pet.image_url} alt={pet.name} className="pet-image" />
            <h3>{pet.name}</h3>
            <p><strong>Breed:</strong> {pet.breed}</p>
            <p><strong>Age:</strong> {pet.age} years</p>
            <p><strong>Description:</strong> {pet.description}</p>
            <div className="admin-actions">
              <button
                className="button button--secondary"
                onClick={() => handleEditClick(pet.id)} // Navigate to edit pet page
              >
                Edit
              </button>
              <button
                className="button button--danger"
                onClick={() => handleDeleteClick(pet.id)} // Delete the pet
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminViewPets;