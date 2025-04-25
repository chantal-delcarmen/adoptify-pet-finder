import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import AdminPanel from '../components/AdminPanel';
import PetCard from '../components/PetCard'; // Import the PetCard component

function AdminViewPets() {
  const [pets, setPets] = useState([]); // State to store the list of pets
  const [error, setError] = useState(''); // State to store error messages
  const [refresh, setRefresh] = useState(false); // State to trigger re-fetching of pets
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const fetchPets = async () => {
      const token = localStorage.getItem('access'); // Get the admin token from localStorage
      try {
        const response = await fetch('http://localhost:8000/api/pets/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Include token for authentication
          },
        });
        if (response.ok) {
          const data = await response.json(); // Parse the response JSON
          setPets(data); // Update the pets state with the fetched data
        } else {
          setError('Failed to fetch pets'); // Set an error message if the request fails
        }
      } catch (err) {
        setError('An error occurred while fetching pets'); // Handle any errors during the fetch process
      }
    };

    fetchPets(); // Fetch the list of pets when the component mounts
  }, [refresh]); // Re-fetch pets when the refresh state changes

  const handleEditClick = (petId) => {
    // Navigate to the edit pet page with the pet ID as a query parameter
    navigate(`/edit-pet?petId=${petId}`);
  };

  const handleEditComplete = () => {
    setRefresh((prev) => !prev); // Toggle the refresh state to trigger a re-fetch
  };

  const handleDeleteClick = async (petId) => {
    const token = localStorage.getItem('access'); // Get the admin token from localStorage
    try {
      const response = await fetch(`http://localhost:8000/api/pets/${petId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
      });
      if (response.ok) {
        setPets((prevPets) => prevPets.filter((pet) => pet.pet_id !== petId)); // Remove the deleted pet from the state
        alert('Pet deleted successfully!'); // Show a success alert
      } else {
        setError('Failed to delete pet'); // Set an error message if the delete request fails
      }
    } catch (err) {
      setError('An error occurred while deleting the pet'); // Handle any errors during the delete process
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
        {error && <p className="error-message">{error}</p>} {/* Display error message if any */}
        {pets.length === 0 ? (
          <p className="no-pets-message">No pets to display.</p> 
        ) : (
          pets.map((pet) => (
            <PetCard
              key={pet.petID} // Unique key for each PetCard
              pet={pet} // Pass the pet data to the PetCard
              isAdmin={true} // Indicate that this is an admin view
              onEdit={handleEditClick} // Pass the edit handler
              onDelete={handleDeleteClick} // Pass the delete handler
            />
          ))
        )}
      </div>
    </div>
  );
}

export default AdminViewPets;