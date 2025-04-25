import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel'; // Import the AdminPanel component for the admin navbar
import PetForm from '../components/PetForm'; // Import the PetForm component for editing pet details
import { fetchShelters } from '../utils/FetchShelters'; // Import the fetchShelters utility
import { refreshAccessToken } from '../utils/AuthUtils'; // Import the token refresh utility

function EditPet() {
    const [searchParams] = useSearchParams(); // Get query parameters from the URL
    const petId = searchParams.get('petId'); // Extract the pet ID from the query parameters
    const [petData, setPetData] = useState(null); // State to store the pet's current data
    const [shelters, setShelters] = useState([]); // State to store the list of shelters
    const navigate = useNavigate(); // Initialize navigation

    useEffect(() => {
        const fetchPetData = async () => {
            let token = localStorage.getItem('access'); // Retrieve the access token from localStorage

            // Refresh the token if necessary
            if (!token) {
                token = await refreshAccessToken(); // Use the AuthUtils function to refresh the token
                if (!token) {
                    console.error('Failed to refresh token'); // Log an error if token refresh fails
                    navigate('/login'); // Redirect to login if token refresh fails
                    return;
                }
            }

            try {
                const response = await fetch(`http://localhost:8000/api/pets/${petId}/`, {
                    headers: { Authorization: `Bearer ${token}` }, // Include the token for authentication
                });
                if (response.ok) {
                    const data = await response.json(); // Parse the response JSON
                    setPetData(data); // Update the petData state with the fetched data
                } else {
                    console.error('Failed to fetch pet data'); // Log an error if the request fails
                }
            } catch (err) {
                console.error('Error fetching pet data:', err); // Handle any errors during the fetch process
            }
        };

        const fetchSheltersData = async () => {
            let token = localStorage.getItem('access'); // Retrieve the access token from localStorage

            // Refresh the token if necessary
            if (!token) {
                token = await refreshAccessToken(); // Use the AuthUtils function to refresh the token
                if (!token) {
                    console.error('Failed to refresh token'); // Log an error if token refresh fails
                    navigate('/login'); // Redirect to login if token refresh fails
                    return;
                }
            }

            // Fetch shelters using the utility
            const sheltersData = await fetchShelters(token);
            setShelters(sheltersData); // Update the shelters state with the fetched data
        };

        fetchPetData(); // Fetch the pet's current data when the component mounts
        fetchSheltersData(); // Fetch the list of shelters when the component mounts
    }, [petId, navigate]); // Dependency array ensures the effect runs when `petId` or `navigate` changes

    const handleEditPet = async (formData) => {
        let token = localStorage.getItem('access'); // Retrieve the access token from localStorage

        // Refresh the token if necessary
        if (!token) {
            token = await refreshAccessToken(); // Use the AuthUtils function to refresh the token
            if (!token) {
                console.error('Failed to refresh token'); // Log an error if token refresh fails
                navigate('/login'); // Redirect to login if token refresh fails
                return;
            }
        }

        const formDataToSend = new FormData(); // Create a new FormData object
        Object.keys(formData).forEach((key) => {
            if (key === 'image' && typeof formData.image !== 'object') {
                return; // Skip the image field if no new file is selected
            }
            formDataToSend.append(key, formData[key]); // Append each form field to the FormData object
        });

        try {
            const response = await fetch(`http://localhost:8000/api/pets/${petId}/`, {
                method: 'PUT', // Use the PUT method to update the pet
                headers: { Authorization: `Bearer ${token}` }, // Include the token for authentication
                body: formDataToSend, // Send the FormData object as the request body
            });

            if (!response.ok) {
                const errorData = await response.json(); // Parse the error response JSON
                console.error('Error response:', errorData); // Log the error response
                throw new Error(errorData.detail || 'Failed to update pet'); // Throw an error with the response message
            }

            alert('Pet updated successfully!'); // Show a success alert
            navigate('/admin-view-pets'); // Redirect to the admin view pets page
        } catch (error) {
            console.error('Error updating pet:', error); // Log any errors during the update process
            alert(error.message || 'An error occurred while updating the pet.'); // Show an error alert
        }
    };

    if (!petData) return <p>Loading...</p>; // Show a loading message if pet data is not yet available

    return (
        <div>
            <AdminPanel /> {/* Include the AdminPanel component for the admin navbar */}
            <h1>Edit Pet</h1> {/* Page heading */}
            <PetForm initialData={petData} onSubmit={handleEditPet} shelters={shelters} /> {/* PetForm component */}
        </div>
    );
}

export default EditPet; // Export the EditPet component