import React, { useState, useEffect } from 'react';

function PetForm({ initialData, onSubmit, shelters }) {
    const [formData, setFormData] = useState(initialData || {
        name: '',
        age: '',
        gender: '',
        domesticated: false,
        pet_type: '',
        shelter_id: '',
        image: null,
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
        } catch (err) {
            console.error('Error:', err);
            setError('An error occurred. Please try again.');
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