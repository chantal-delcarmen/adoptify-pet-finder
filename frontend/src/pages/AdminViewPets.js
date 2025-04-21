import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import AdminPanel from '../components/AdminPanel';
import PetCard from '../components/PetCard'; // Import the PetCard component

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
        setPets((prevPets) => prevPets.filter((pet) => pet.petID !== petId)); // Remove the deleted pet from the list
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

      <h2>All Pets</h2>
      <p>Manage all pets in the system.</p>

      {/* Pets List */}
      <div className="pets-list">
        {error && <p className="error-message">{error}</p>}
        {pets.map((pet) => (
          <PetCard
            key={pet.petID}
            pet={pet}
            isAdmin={true} // Indicate that this is an admin view
            onEdit={handleEditClick} // Pass the edit handler
            onDelete={handleDeleteClick} // Pass the delete handler
          />
        ))}
      </div>
    </div>
  );
}

export default AdminViewPets;