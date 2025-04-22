import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Import heart icons

function PetCard({ pet, isAdmin, onEdit, onDelete }) {
    const [isFavorited, setIsFavorited] = useState(false); // State to track if the pet is favorited

    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            const token = localStorage.getItem('access');
            if (!token) return;

            try {
                const response = await fetch(`http://localhost:8000/api/favourite/${pet.pet_id}/`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setIsFavorited(true); // Set to true if the pet is already favorited
                }
            } catch (err) {
                console.error('Error fetching favorite status:', err);
            }
        };

        fetchFavoriteStatus();
    }, [pet.pet_id]);
    const handleFavorite = async () => {
        const token = localStorage.getItem('access');
        if (!token) {
            alert('You must be logged in to favorite or unfavorite a pet.');
            return;
        }

        try {

            // Use the appropriate method based on the current state
            const method = isFavorited ? 'DELETE' : 'POST';
            const response = await fetch(`http://localhost:8000/api/favourite/${pet.pet_id}/`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setIsFavorited(!isFavorited); // Toggle the favorite state
                //alert(isFavorited ? 'Pet removed from favorites!' : 'Pet added to favorites!');
            } else {
                // Add to favorites
                const response = await fetch(`http://localhost:8000/api/favourite/${pet.pet_id}/add/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setIsFavorited(true);
                    alert('Pet added to favorites!');
                } else {
                    const data = await response.json();
                    console.error('Backend error:', data);
                    alert(data.message || 'Failed to add pet to favorites.');
                }
            }
        } catch (err) {
            console.error('Error toggling favorite status:', err);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="pet-card">
            {/* Heart Icon in the Top-Right Corner */}
            {!isAdmin && (
                <button className="favorite-icon" onClick={handleFavoriteToggle}>
                    {isFavorited ? <FaHeart className="heart-icon favorited" /> : <FaRegHeart className="heart-icon" />}
                </button>
            )}

            <img src={pet.image} alt={pet.name} className="pet-image" />
            <h3>{pet.name}</h3>
            <p><strong>Gender:</strong> {pet.gender}</p>
            <p><strong>Age:</strong> {pet.age} years</p>
            <p><strong>Domesticated:</strong> {pet.domesticated ? 'Yes' : 'No'}</p>
            <p><strong>Type:</strong> {pet.pet_type}</p>
            <p><strong>Status:</strong> {pet.adoption_status}</p>

            <div className="pet-card-actions">
                {isAdmin && (
                    <div className="admin-actions">
                        <button className="button button--secondary" onClick={() => onEdit(pet.pet_id)}>
                            Edit
                        </button>
                        <button className="button button--danger" onClick={() => onDelete(pet.pet_id)}>
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

PetCard.propTypes = {
    pet: PropTypes.shape({
        pet_id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        breed: PropTypes.string.isRequired,
        gender: PropTypes.string.isRequired,
        age: PropTypes.number.isRequired,
        domesticated: PropTypes.bool.isRequired,
        pet_type: PropTypes.string.isRequired, // Updated field
        adoption_status: PropTypes.string.isRequired, // Updated field
        description: PropTypes.string.isRequired,
        petImage: PropTypes.string.isRequired,
    }).isRequired,
    isAdmin: PropTypes.bool,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
};

PetCard.defaultProps = {
    isAdmin: false,
    onEdit: null,
    onDelete: null,
};

export default PetCard;