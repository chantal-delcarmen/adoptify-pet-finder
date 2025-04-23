import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel'; // Import the AdminPanel component
import { AddButton, EditButton, RemoveButton } from '../components/Buttons'; // Import reusable button components

function ManageShelters() {
    const [shelters, setShelters] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShelters = async () => {
            const token = localStorage.getItem('access');
            const response = await fetch('http://localhost:8000/api/admin/shelters/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setShelters(data);
            } else {
                console.error('Failed to fetch shelters');
            }
        };

        fetchShelters();
    }, []);

    const handleEdit = (shelterId) => {
        navigate(`/admin/edit-shelter/${shelterId}`);
    };

    const handleDelete = async (shelterId) => {
        // Find the shelter by ID
        const shelter = shelters.find((shelter) => shelter.shelter_id === shelterId);

        // Check if the shelter has associated pets
        if (shelter.pets && shelter.pets.length > 0) {
            alert('This shelter has pets associated with it. Please reassign or delete the pets first.');
            return;
        }

        // Confirm deletion
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this shelter? This action cannot be undone.'
        );
        if (!confirmDelete) return;

        // Proceed with deletion
        const token = localStorage.getItem('access');
        const response = await fetch(`http://localhost:8000/api/admin/shelter/${shelterId}/`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
            alert('Shelter deleted successfully');
            setShelters(shelters.filter((shelter) => shelter.shelter_id !== shelterId));
        } else {
            console.error('Failed to delete shelter');
        }
    };

    return (
        <div className="manage-shelters-page">
            <AdminPanel /> {/* Include the AdminPanel for the navbar and header */}

            <h1 className="page-title">Manage Shelters</h1>
            <AddButton onClick={() => navigate('/admin/add-shelter')}>Add Shelter</AddButton>
            <table className="shelters-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Website</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {shelters.map((shelter) => (
                        <tr key={shelter.shelter_id}>
                            <td>{shelter.name}</td>
                            <td>{shelter.address}</td>
                            <td>{shelter.phone_number}</td>
                            <td>
                                <a href={shelter.website_url} target="_blank" rel="noopener noreferrer">
                                    {shelter.website_url}
                                </a>
                            </td>
                            <td>
                                <div className="admin-actions">
                                    <EditButton onClick={() => handleEdit(shelter.shelter_id)} />
                                    <RemoveButton onClick={() => handleDelete(shelter.shelter_id)} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageShelters;