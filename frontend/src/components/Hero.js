import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

// Define the Hero functional component
function Hero() {
  const navigate = useNavigate(); // Initialize navigate

  return (
    // Main container for the Hero section
    <div className="home-hero">
      {/* Main heading for the Hero section */}
      <div className="home-hero__content">
        <h1>Adoptify</h1>
        <h2>Connecting You with Your New Best Friend</h2>
        <button
          className="button button--primary"
          onClick={() => navigate('/pets')} // Navigate to /pets
        >
          View Pets
        </button>
      </div>
    </div>
  );
}

// Export the Hero component to be used in other parts of the application
export default Hero;