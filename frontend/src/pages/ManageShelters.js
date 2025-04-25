import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel'; // Import the AdminPanel component
import { AddButton, EditButton, RemoveButton } from '../components/Buttons'; // Import reusable button components

function ManageShelters() {
    const [shelters, setShelters] = useState([]); // State to store the list of shelters
    const navigate = useNavigate(); // Initialize navigation

    useEffect(() => {
        const fetchShelters = async () => {
            const token = localStorage.getItem('access'); // Retrieve the access token from localStorage
            const response = await fetch('http://localhost:8000/api/admin/shelters/', {
                headers: { Authorization: `Bearer ${token}` }, // Include the token for authentication
            });
            if (response.ok) {
                const data = await response.json(); // Parse the response JSON
                setShelters(data); // Update the shelters state with the fetched data
            } else {
                console.error('Failed to fetch shelters'); // Log an error if the request fails
            }
        };

        fetchShelters(); // Fetch the list of shelters when the component mounts
    }, []); // Empty dependency array ensures the effect runs only once

    const handleEdit = (shelterId) => {
        // Navigate to the edit shelter page with the shelter ID
        navigate(`/admin/edit-shelter/${shelterId}`);
    };

    const handleDelete = async (shelterId) => {
        // Find the shelter by ID
        const shelter = shelters.find((shelter) => shelter.shelter_id === shelterId);

        // Check if the shelter has associated pets
        if (shelter.pets && shelter.pets.length > 0) {
            alert('This shelter has pets associated with it. Please reassign or delete the pets first.'); // Show an alert if pets are associated
            return;
        }

        // Confirm deletion
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this shelter? This action cannot be undone.' // Confirmation message
        );
        if (!confirmDelete) return; // Exit if the user cancels the deletion

        // Proceed with deletion
        const token = localStorage.getItem('access'); // Retrieve the access token from localStorage
        const response = await fetch(`http://localhost:8000/api/admin/shelter/${shelterId}/`, {
            method: 'DELETE', // Use the DELETE method to remove the shelter
            headers: { Authorization: `Bearer ${token}` }, // Include the token for authentication
        });
        if (response.ok) {
            alert('Shelter deleted successfully'); // Show a success alert
            setShelters(shelters.filter((shelter) => shelter.shelter_id !== shelterId)); // Remove the deleted shelter from the state
        } else {
            console.error('Failed to delete shelter'); // Log an error if the request fails
        }
    };

    return (
        <div className="manage-shelters-page">
            <AdminPanel /> {/* Include the AdminPanel for the navbar and header */}

            <h1 className="page-title">Manage Shelters</h1> {/* Page heading */}
            <AddButton onClick={() => navigate('/admin/add-shelter')}>Add Shelter</AddButton> {/* Button to add a new shelter */}
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
                            <td>{shelter.name}</td> {/* Display the shelter name */}
                            <td>{shelter.address}</td> {/* Display the shelter address */}
                            <td>{shelter.phone_number}</td> {/* Display the shelter phone number */}
                            <td>
                                <a href={shelter.website_url} target="_blank" rel="noopener noreferrer">
                                    {shelter.website_url} {/* Display the shelter website URL */}
                                </a>
                            </td>
                            <td>
                                <div className="admin-actions">
                                    <EditButton onClick={() => handleEdit(shelter.shelter_id)} /> {/* Button to edit the shelter */}
                                    <RemoveButton onClick={() => handleDelete(shelter.shelter_id)} /> {/* Button to delete the shelter */}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageShelters; // Export the ManageShelters component