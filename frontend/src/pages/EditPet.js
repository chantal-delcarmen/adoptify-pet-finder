import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel';
import PetForm from '../components/PetForm';
import { fetchShelters } from '../utils/FetchShelters'; // Import the fetchShelters utility
import { refreshAccessToken } from '../utils/AuthUtils'; // Import the token refresh utility

function EditPet() {
    const [searchParams] = useSearchParams();
    const petId = searchParams.get('petId');
    const [petData, setPetData] = useState(null);
    const [shelters, setShelters] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPetData = async () => {
            let token = localStorage.getItem('access');

            // Refresh the token if necessary
            if (!token) {
                token = await refreshAccessToken();
                if (!token) {
                    console.error('Failed to refresh token');
                    navigate('/login'); // Redirect to login if token refresh fails
                    return;
                }
            }

            try {
                const response = await fetch(`http://localhost:8000/api/pets/${petId}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setPetData(data);
                } else {
                    console.error('Failed to fetch pet data');
                }
            } catch (err) {
                console.error('Error fetching pet data:', err);
            }
        };

        const fetchSheltersData = async () => {
            let token = localStorage.getItem('access');

            // Refresh the token if necessary
            if (!token) {
                token = await refreshAccessToken();
                if (!token) {
                    console.error('Failed to refresh token');
                    navigate('/login');
                    return;
                }
            }

            // Fetch shelters using the utility
            const sheltersData = await fetchShelters(token);
            setShelters(sheltersData);
        };

        fetchPetData();
        fetchSheltersData();
    }, [petId, navigate]);

    const handleEditPet = async (formData) => {
        let token = localStorage.getItem('access');

        // Refresh the token if necessary
        if (!token) {
            token = await refreshAccessToken();
            if (!token) {
                console.error('Failed to refresh token');
                navigate('/login');
                return;
            }
        }

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === 'image' && !formData.image) {
                return; // Skip the image field if no new image is selected
            }
            formDataToSend.append(key, formData[key]);
        });

        try {
            const response = await fetch(`http://localhost:8000/api/pets/${petId}/`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.detail || 'Failed to update pet');
            }

            alert('Pet updated successfully!');
            navigate('/admin-view-pets');
        } catch (error) {
            console.error('Error updating pet:', error);
            alert(error.message || 'An error occurred while updating the pet.');
        }
    };

    if (!petData) return <p>Loading...</p>;

    return (
        <div>
            <AdminPanel />
            <h1>Edit Pet</h1>
            <PetForm initialData={petData} onSubmit={handleEditPet} shelters={shelters} />
        </div>
    );
}

export default EditPet;