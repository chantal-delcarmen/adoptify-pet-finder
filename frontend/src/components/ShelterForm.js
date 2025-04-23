import React, { useState, useEffect } from 'react';

function ShelterForm({ initialData, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone_number: '',
        website_url: '',
    });

    const [error, setError] = useState('');

    // Update formData when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = (data) => {
        const errors = {};
        if (!data.name) errors.name = 'Name is required.';
        if (!data.address) errors.address = 'Address is required.';
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validateForm(formData);
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
                <h1>{initialData ? 'Edit Shelter' : 'Create Shelter'}</h1>

                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="address">Address:</label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="phone_number">Phone Number:</label>
                <input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                />

                <label htmlFor="website_url">Website URL:</label>
                <input
                    type="url"
                    id="website_url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                />

                <button type="submit" className="button button--primary">
                    {initialData ? 'Update Shelter' : 'Create Shelter'}
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default ShelterForm;