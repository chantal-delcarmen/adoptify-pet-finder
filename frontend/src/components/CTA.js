import React from 'react';

function CTA() {
  return (
    <div className="cta">
      <button className="button button--secondary" onClick={() => navigate('/signup')}>Get Started</button>
    </div>
  );
}

export default CTA;