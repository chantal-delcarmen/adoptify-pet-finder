import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../styles/pets.scss'; // Import styles for the Pets page

function Pets() {
  const [pets, setPets] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/pets/');
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

  const handleApplyClick = (petId) => {
    // Navigate to the application page with the pet ID as a query parameter
    navigate(`/apply?petId=${petId}`);
  };

  return (
    <div className="pets-page">
      {/* Navbar */}
      <nav className="navbar">
        <h1>Adoptify</h1>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/pets">Pets</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h2>Pets Available for Adoption</h2>
        <p>Find your perfect companion today!</p>
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
            <button
              className="button button--primary"
              onClick={() => handleApplyClick(pet.id)} // Navigate to application page
            >
              Apply to Adopt Me
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pets;