import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ShelterForm from '../components/ShelterForm';

function EditShelter() {
    const { shelterId } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShelterDetails = async () => {
            const token = localStorage.getItem('access');
            try {
                const response = await fetch(`http://localhost:8000/api/admin/shelter/${shelterId}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setInitialData(data);
                    setLoading(false);
                } else {
                    console.error('Failed to fetch shelter details');
                    navigate('/admin/shelters');
                }
            } catch (error) {
                console.error('Error fetching shelter details:', error);
                navigate('/admin/shelters');
            }
        };

        fetchShelterDetails();
    }, [shelterId, navigate]);

    const handleSubmit = async (formData) => {
        const token = localStorage.getItem('access');
        try {
            const response = await fetch(`http://localhost:8000/api/admin/shelter/${shelterId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('Shelter updated successfully');
                navigate('/admin/shelters');
            } else {
                console.error('Failed to update shelter');
                alert('Failed to update shelter. Please try again.');
            }
        } catch (error) {
            console.error('Error updating shelter:', error);
            alert('An error occurred. Please try again.');
        }
    };

    if (loading) {
        return <p>Loading shelter details...</p>;
    }

    return <ShelterForm initialData={initialData} onSubmit={handleSubmit} />;
}

export default EditShelter;