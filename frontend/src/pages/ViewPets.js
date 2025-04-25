import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Navbar from '../components/Navbar'; // Import the Navbar component
import PetCard from '../components/PetCard'; // Import the PetCard component for displaying pet details
import FilterPets from '../components/FilterPets'; // Import the FilterPets component for filtering pets

function ViewPets() {
  const [pets, setPets] = useState([]); // State to store the list of pets
  const [filteredPets, setFilteredPets] = useState([]); // State to store the filtered list of pets
  const [error, setError] = useState(''); // State to store error messages
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/pets/'); // Fetch the list of pets from the API
        if (response.ok) {
          const data = await response.json(); // Parse the response JSON
          setPets(data); // Update the pets state with the fetched data
          setFilteredPets(data); // Initialize filteredPets with all pets
        } else {
          setError('Failed to fetch pets'); // Set an error message if the request fails
        }
      } catch (err) {
        setError('An error occurred while fetching pets'); // Handle any errors during the fetch process
      }
    };

    fetchPets(); // Fetch the list of pets when the component mounts
  }, []); // Empty dependency array ensures the effect runs only once

  const handleApplyClick = (petId) => {
    // Navigate to the application page with the pet ID as a query parameter
    navigate(`/apply?petId=${petId}`);
  };

  return (
    <div className="pets-page">
      {/* Navbar Component */}
      <Navbar /> {/* Render the Navbar component */}

      {/* Hero Section */}
      <section className="hero">
        <h1>Pets Available for Adoption</h1> {/* Page heading */}
        <p>Find your perfect companion today!</p> {/* Subheading */}
      </section>

      {/* FilterPets Component */}
      <FilterPets pets={pets} onFilter={setFilteredPets} /> {/* Render the FilterPets component */}

      {/* Pets List */}
      <div className="pets-list">
        {error && <p className="error-message">{error}</p>} {/* Display error message if any */}
        {filteredPets.length > 0 ? (
          filteredPets.map((pet) => (
            <PetCard
              key={pet.petID} // Unique key for each PetCard
              pet={pet} // Pass the pet data to the PetCard
              onPrimaryAction={handleApplyClick} // Pass the apply handler
              primaryActionLabel="Apply to Adopt Me" // Label for the button
            />
          ))
        ) : (
          <p>No pets match the selected criteria.</p> /* Message if no pets match the filter */
        )}
      </div>
    </div>
  );
}

export default ViewPets; // Export the Pets component