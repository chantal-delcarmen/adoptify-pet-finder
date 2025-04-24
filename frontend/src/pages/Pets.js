import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Navbar from '../components/Navbar';
import PetCard from '../components/PetCard'; // Import the PetCard component
import FilterPets from '../components/FilterPets'; // Import the FilterPets component

function Pets() {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]); // State for filtered pets
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/pets/');
        if (response.ok) {
          const data = await response.json();
          setPets(data);
          console.log('Pets data:', data); // Debug the response
          setFilteredPets(data); // Initialize filteredPets with all pets

        } else {
          setError('Failed to fetch pets');
        }
      } catch (err) {
        setError('An error occurred while fetching pets');
      }
    };

    fetchPets();
  }, []);

  const handleApplyClick = (petId) => {
    // Navigate to the application page with the pet ID as a query parameter
    navigate(`/apply?petId=${petId}`);
  };

  return (
    <div className="pets-page">
      {/* Navbar Component */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <h2>Pets Available for Adoption</h2>
        <p>Find your perfect companion today!</p>
      </section>

      {/* FilterPets Component */}
      <FilterPets pets={pets} onFilter={setFilteredPets} />

      {/* Pets List */}
      <div className="pets-list">
        {error && <p className="error-message">{error}</p>}
        {filteredPets.length > 0 ? (
          filteredPets.map((pet) => (
            <PetCard
              key={pet.petID}
              pet={pet}
              image={pet.image}
              onPrimaryAction={handleApplyClick} // Pass the apply handler
              primaryActionLabel="Apply to Adopt Me" // Label for the button
            />
          ))
        ) : (
          <p>No pets match the selected criteria.</p>
        )}
      </div>
    </div>
  );
}

export default Pets;