import React from 'react'; // Import React to use JSX and create components

// Define the Hero functional component
function Hero() {
  return (
    // Main container for the Hero section
    <div className="hero">
      {/* Main heading for the Hero section */}
      <h1>Adoptify</h1>
      
      {/* Subheading for the Hero section */}
      <h2>Connecting You with Your New Best Friend</h2>
      
      {/* Primary button to view pets */}
      <button className="button button--primary">View Pets</button>
    </div>
  );
}

// Export the Hero component to be used in other parts of the application
export default Hero;