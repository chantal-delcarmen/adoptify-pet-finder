import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function PetForm({ initialData, onSubmit, shelters }) {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        domesticated: false,
        pet_type: '',
        shelter_id: '',
        adopted_status: '', // Ensure this matches the form field name
        image: null,
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    // Update formData when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                adopted_status: initialData.adoption_status || '', // Map adoption_status to adopted_status
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await onSubmit(formData); // Call the onSubmit function passed as a prop
            setSuccess('Operation successful!');
            alert('Operation successful!');
            navigate('/admin-view-pets'); // Redirect to the admin view pets page after successful submission
        } catch (err) {
            console.error('Error:', err);
            setError('An error occurred. Please try again.');
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="form-page">
            <form onSubmit={handleSubmit} className="form">
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="age">Age:</label>
                <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="gender">Gender:</label>
                <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <label htmlFor="domesticated">Domesticated:</label>
                <input
                    type="checkbox"
                    id="domesticated"
                    name="domesticated"
                    checked={formData.domesticated}
                    onChange={handleChange}
                />

                <label htmlFor="pet_type">Pet Type:</label>
                <select
                    id="pet_type"
                    name="pet_type"
                    value={formData.pet_type}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Pet Type</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Rabbit">Rabbit</option>
                </select>

                <label htmlFor="shelter_id">Shelter:</label>
                <select
                    id="shelter_id"
                    name="shelter_id"
                    value={formData.shelter_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Shelter</option>
                    {shelters.map((shelter) => (
                        <option key={shelter.id} value={shelter.id}>
                            {shelter.name}
                        </option>
                    ))}
                </select>

                <label htmlFor="adopted_status">Adopted Status:</label>
                <select
                    id="adopted_status"
                    name="adopted_status"
                    value={formData.adopted_status}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Adopted Status</option>
                    <option value="Available">Available</option>
                    <option value="Pending">Pending</option>
                    <option value="Adopted">Adopted</option>
                </select>

                <label htmlFor="image">Image:</label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleFileChange}
                />

                <button type="submit" className="button button--primary">
                    Submit
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </div>
    );
}

export default PetForm;