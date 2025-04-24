import React, { useState, useEffect } from 'react';

function PetForm({ initialData, onSubmit, shelters }) {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        domesticated: false,
        pet_type: '',
        shelter_id: '',
        adoption_status: '', // Ensure this matches the form field name
        image: null,
    });

    const [error, setError] = useState('');

    // Update formData when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                adoption_status: initialData.adoption_status || '', // Map adoption_status to adoption_status
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

    // Validate the form data
    const validatePetForm = (data, isEdit = false) => {
        const errors = {};
        if (!data.name) errors.name = 'Name is required.';
        if (!data.age || data.age <= 0) errors.age = 'Age must be greater than 0.';
        if (!data.gender) errors.gender = 'Gender is required.';
        if (!data.pet_type) errors.pet_type = 'Pet type is required.';
        if (!data.shelter_id) errors.shelter_id = 'Shelter is required.';
        // Conditionally validate the image field
        if (!isEdit && !data.image) errors.image = 'Image is required for new pets.';
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Pass a flag to indicate if this is an edit
        const isEdit = !!initialData; // If `initialData` exists, it's an edit
        const validationErrors = validatePetForm(formData, isEdit);
        if (Object.keys(validationErrors).length > 0) {
            setError(Object.values(validationErrors).join(' '));
            return;
        }

        setError('');
        onSubmit(formData); // Call the parent-provided onSubmit function
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

                <label htmlFor="adoption_status">Adoption Status:</label>
                <select
                    id="adoption_status"
                    name="adoption_status"
                    value={formData.adoption_status}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Adoption Status</option>
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
        </div>
    );
}

export default PetForm;