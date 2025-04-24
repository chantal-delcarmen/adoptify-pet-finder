import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Import heart icons
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import {EditButton, RemoveButton} from './Buttons'; // Import buttons


function PetCard({ pet, isAdmin, onEdit, onDelete }) {
    const [isFavorited, setIsFavorited] = useState(false); // State to track if the pet is favorited
    const navigate = useNavigate(); // Initialize navigation


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

    const handleApplyToAdopt = () => {
        // Navigate to the /apply page with the pet ID as a query parameter
        navigate(`/apply?petId=${pet.pet_id}`);
    };

    return (
        <div className="pet-card">
            {/* Heart Icon in the Top-Right Corner */}
            {!isAdmin && (
                <button className="favorite-icon" onClick={handleFavorite}>
                    {isFavorited ? <FaHeart className="heart-icon favorited" /> : <FaRegHeart className="heart-icon" />}
                </button>
            )}
            {console.log("Pet object in PetCard:", pet)}
            <img 
                src={`http://localhost:8000${pet.image || '/media/default-image.jpg'}`} 
                alt={pet.name} 
                style={{
                    height: '200px',
                    width: 'auto',
                    display: 'block',
                    margin: '0 auto',
                    objectFit: 'cover',
                  }}
                className="pet-image" />
            <h3>{pet.name}</h3>
            <p><strong>Gender:</strong> {pet.gender}</p>
            <p><strong>Age:</strong> {pet.age} years</p>
            <p><strong>Domesticated:</strong> {pet.domesticated ? 'Yes' : 'No'}</p>
            <p><strong>Type:</strong> {pet.pet_type}</p>
            <p><strong>Status:</strong> {pet.adoption_status}</p>
            <p><strong>Shelter:</strong> {pet.shelter_name}</p> {/* Added Shelter */}

            <div className="pet-card-actions">
                {isAdmin ? (
                    <div className="admin-actions">
                        <EditButton onClick={() => onEdit(pet.pet_id)} />
                        <RemoveButton onClick={() => onDelete(pet.pet_id)} />
                    </div>
                ) : (
                    <button className="button button--primary" onClick={handleApplyToAdopt}>
                        Apply to Adopt Me
                    </button>
                )}
            </div>
        </div>
    );
}

PetCard.propTypes = {
    pet: PropTypes.shape({
        pet_id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        gender: PropTypes.string.isRequired,
        age: PropTypes.number.isRequired,
        domesticated: PropTypes.bool.isRequired,
        pet_type: PropTypes.string.isRequired, // Updated field
        adoption_status: PropTypes.string.isRequired, // Updated field
        description: PropTypes.string.isRequired,
        shelter_name: PropTypes.string.isRequired, // Added Shelter
        image: PropTypes.string.isRequired,
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