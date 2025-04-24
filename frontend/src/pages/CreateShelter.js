import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShelterForm from '../components/ShelterForm';

function CreateShelter() {
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        const token = localStorage.getItem('access');
        try {
            const response = await fetch('http://localhost:8000/api/admin/shelter/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('Shelter created successfully');
                navigate('/admin/shelters');
            } else {
                console.error('Failed to create shelter');
                alert('Failed to create shelter. Please try again.');
            }
        } catch (error) {
            console.error('Error creating shelter:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return <ShelterForm onSubmit={handleSubmit} />;
}

export default CreateShelter;