import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel';
import PetForm from '../components/PetForm';

function EditPet() {
    const [searchParams] = useSearchParams();
    const petId = searchParams.get('petId');
    const [petData, setPetData] = useState(null);
    const [shelters, setShelters] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPetData = async () => {
            const token = localStorage.getItem('access');
            const response = await fetch(`http://localhost:8000/api/pets/${petId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setPetData(data);
            }
        };

        const fetchShelters = async () => {
            const token = localStorage.getItem('access');
            const response = await fetch('http://localhost:8000/api/admin/shelters/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setShelters(data.map((shelter) => ({ id: shelter.shelter_id, name: shelter.name })));
            }
        };

        fetchPetData();
        fetchShelters();
    }, [petId]);

    const handleEditPet = async (formData) => {
        const token = localStorage.getItem('access');
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        const response = await fetch(`http://localhost:8000/api/pets/${petId}/`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: formDataToSend,
        });

        if (!response.ok) {
            throw new Error('Failed to update pet');
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