import React from 'react';
import '../styles/hero.scss';

function Hero() {
  return (
    <div className="hero">
      <h1>Adoptify 🐾</h1>
      <p>Connecting you with your new best friend.</p>
      <button className="hero-button">View Pets</button>
    </div>
  );
}

export default Hero;