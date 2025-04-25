import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Navbar from '../components/Navbar'; // Import the Navbar component
import Hero from '../components/Hero'; // Import the Hero component for the hero section
import CTA from '../components/CTA'; // Import the CTA (Call-To-Action) component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon for icons
import { faSearch, faInfoCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons'; // Import specific icons

function Home({ message }) {
  const navigate = useNavigate(); // Initialize navigate for programmatic navigation

  return (
    <div>
      {/* Navbar Component */}
      <Navbar /> {/* Render the Navbar component */}

      {/* Hero Section */}
      <Hero /> {/* Render the Hero component */}

      <div className="content">
        {/* Columns Section */}
        <div className="columns">
          {/* Left Column */}
          <div className="left-column">
            <div className="about">
              <h2>About Us</h2>
              <p>
                Adoptify is a dedicated online platform that helps connect individuals with adoptable pets from shelters and rescue groups. We make finding your new best friend easy and accessible.
              </p>
            </div>

            <div className="how-it-works">
              <h2>How it Works</h2>
              <div className="steps">
                <div className="step">
                  <FontAwesomeIcon icon={faSearch} className="icon" /> {/* Search icon */}
                  <h3>Search Pets</h3>
                  <p>Explore our listings of pets available for adoption.</p>
                </div>
                <div className="step">
                  <FontAwesomeIcon icon={faInfoCircle} className="icon" /> {/* Info icon */}
                  <h3>Learn More</h3>
                  <p>Read about pet personality, care, and adoption tips.</p>
                </div>
                <div className="step">
                  <FontAwesomeIcon icon={faArrowRight} className="icon" /> {/* Arrow icon */}
                  <h3>Apply Online</h3>
                  <p>Fill out an application form to begin the adoption process.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            <div className="find-a-pet">
              <h2>Find a Pet</h2>
              <p>
                Browse through thousands of adoptable dogs, cats, and more. Use filters to narrow down your search and find the ideal pet for you.
              </p>
              <button
                className="button button--primary"
                onClick={() => navigate('/pets')} // Navigate to /pets when clicked
              >
                Search Now
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom-section">
          <h2>Start Your Adoption Journey Today!</h2>
          <p>Find your perfect pet and give them the loving home they deserve.</p>
          <button
            className="button button--primary"
            onClick={() => navigate('/pets')} // Navigate to /pets when clicked
          >
            Browse Pets
          </button>
        </div>
      </div>

      {/* Call-To-Action Section */}
      <CTA /> {/* Render the CTA component */}
    </div>
  );
}

export default Home; // Export the Home component