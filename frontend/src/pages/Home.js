// filepath: c:\Users\chant\OneDrive - University of Calgary\Desktop\adoptify-pet-finder\frontend\src\pages\Home.js
import React from 'react';
import Hero from '../components/Hero';
import Card from '../components/Card';

function Home({ message }) {
  return (
    <div>
      <Hero />
      <div className="card-container">
        <Card title="Search Pets" description="Explore our listings of pets available for adoption." />
        <Card title="Learn More" description="Read about pet personality, care, and adoption tips." />
        <Card title="Apply Online" description="Fill out an application form to begin the adoption process." />
      </div>
      <div style={{ padding: "2rem" }}>
        <h2>Backend Status</h2>
        <p><strong>Message from backend:</strong> {message}</p>
      </div>
    </div>
  );
}

export default Home;