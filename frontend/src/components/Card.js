import React from 'react';

function Card({ title, description, buttonText }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
      {buttonText && <button className="button button--secondary">{buttonText}</button>}
    </div>
  );
}

export default Card;