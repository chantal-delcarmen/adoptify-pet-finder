import React from 'react';
import { useNavigate } from 'react-router-dom';

function CTA() {
  const navigate = useNavigate();

  return (
    <div className="cta">
      <button className="button button--tertiary" onClick={() => navigate('/signup')}>Get Started</button>
    </div>
  );
}

export default CTA;