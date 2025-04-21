import React from 'react';
import PropTypes from 'prop-types';

function PetCard({ pet, onPrimaryAction, primaryActionLabel, isAdmin, onEdit, onDelete }) {
  return (
    <div className="pet-card">
      <img src={pet.petImage} alt={pet.name} className="pet-image" />
      <h3>{pet.name}</h3>
      <p><strong>Gender:</strong> {pet.gender}</p>
      <p><strong>Age:</strong> {pet.age} years</p>
      <p><strong>Domesticated:</strong> {pet.domesticated ? 'Yes' : 'No'}</p>
      <p><strong>Type:</strong> {pet.petType}</p>
      <p><strong>Status:</strong> {pet.adoptionStatus}</p>

      {isAdmin ? (
        <div className="admin-actions">
          <button className="button button--secondary" onClick={() => onEdit(pet.petID)}>
            Edit
          </button>
          <button className="button button--danger" onClick={() => onDelete(pet.petID)}>
            Delete
          </button>
        </div>
      ) : (
        <button className="button button--primary" onClick={() => onPrimaryAction(pet.petID)}>
          {primaryActionLabel}
        </button>
      )}
    </div>
  );
}

PetCard.propTypes = {
  pet: PropTypes.shape({
    petID: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    breed: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    domesticated: PropTypes.bool.isRequired,
    petType: PropTypes.string.isRequired,
    adoptionStatus: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    petImage: PropTypes.string.isRequired,
  }).isRequired,
  onPrimaryAction: PropTypes.func,
  primaryActionLabel: PropTypes.string,
  isAdmin: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

PetCard.defaultProps = {
  onPrimaryAction: null,
  primaryActionLabel: 'Take Action',
  isAdmin: false,
  onEdit: null,
  onDelete: null,
};

export default PetCard;