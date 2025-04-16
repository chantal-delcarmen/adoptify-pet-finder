// filepath: c:\Users\chant\OneDrive - University of Calgary\Desktop\adoptify-pet-finder\frontend\src\pages\Home.js
import React from 'react';
import Hero from '../components/Hero';
import Card from '../components/Card';

function Home({ message }) {
  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <section className="about-section">
        <h2>About Us</h2>
        <p>
          Adoptify is a dedicated online platform that helps connect individuals with adoptable pets from shelters and rescue groups. We make finding your new best friend easy and accessible.
        </p>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2>How it Works</h2>
        <div className="card-container">
          <Card title="Search Pets" description="Explore our listings of pets available for adoption." buttonText="Search Now" />
          <Card title="Learn More" description="Read about pet personality, care, and adoption tips." buttonText="Learn More" />
          <Card title="Apply Online" description="Fill out an application form to begin the adoption process." buttonText="Apply Now" />
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <h2>Start Your Adoption Journey Today!</h2>
        <p>Find your perfect pet and give them the loving home they deserve.</p>
        <button className="button button--primary">Get Started</button>
      </footer>
    </div>
  );
}

export default Home;