import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShelterForm from '../components/ShelterForm'; // Import the ShelterForm component for creating shelters

function CreateShelter() {
    const navigate = useNavigate(); // Initialize navigation

    const handleSubmit = async (formData) => {
        const token = localStorage.getItem('access'); // Retrieve the access token from localStorage
        try {
            const response = await fetch('http://localhost:8000/api/admin/shelter/', {
                method: 'POST', // Use the POST method to create a new shelter
                headers: {
                    'Content-Type': 'application/json', // Specify the content type as JSON
                    Authorization: `Bearer ${token}`, // Include the token for authentication
                },
                body: JSON.stringify(formData), // Convert the form data to a JSON string
            });
            if (response.ok) {
                alert('Shelter created successfully'); // Show a success alert
                navigate('/admin/shelters'); // Redirect to the admin shelters page
            } else {
                console.error('Failed to create shelter'); // Log an error if the request fails
                alert('Failed to create shelter. Please try again.'); // Show an error alert
            }
        } catch (error) {
            console.error('Error creating shelter:', error); // Log any errors during the creation process
            alert('An error occurred. Please try again.'); // Show a generic error alert
        }
    };

    return <ShelterForm onSubmit={handleSubmit} />; // Render the ShelterForm component and pass the handleSubmit function
}

export default CreateShelter; // Export the CreateShelter component