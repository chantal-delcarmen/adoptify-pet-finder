import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ShelterForm from '../components/ShelterForm'; // Import the ShelterForm component for editing shelter details

function EditShelter() {
    const { shelterId } = useParams(); // Extract the shelter ID from the URL parameters
    const navigate = useNavigate(); // Initialize navigation
    const [initialData, setInitialData] = useState(null); // State to store the initial shelter data
    const [loading, setLoading] = useState(true); // State to track the loading status

    useEffect(() => {
        const fetchShelterDetails = async () => {
            const token = localStorage.getItem('access'); // Retrieve the access token from localStorage
            try {
                const response = await fetch(`http://localhost:8000/api/admin/shelter/${shelterId}/`, {
                    headers: { Authorization: `Bearer ${token}` }, // Include the token for authentication
                });
                if (response.ok) {
                    const data = await response.json(); // Parse the response JSON
                    setInitialData(data); // Update the initialData state with the fetched data
                    setLoading(false); // Set loading to false after data is fetched
                } else {
                    console.error('Failed to fetch shelter details'); // Log an error if the request fails
                    navigate('/admin/shelters'); // Redirect to the admin shelters page
                }
            } catch (error) {
                console.error('Error fetching shelter details:', error); // Handle any errors during the fetch process
                navigate('/admin/shelters'); // Redirect to the admin shelters page
            }
        };

        fetchShelterDetails(); // Fetch the shelter details when the component mounts
    }, [shelterId, navigate]); // Dependency array ensures the effect runs when `shelterId` or `navigate` changes

    const handleSubmit = async (formData) => {
        const token = localStorage.getItem('access'); // Retrieve the access token from localStorage

        // Remove the image field if it is empty
        if (!formData.image) {
            delete formData.image; // Delete the image field from the form data
        }

        try {
            const response = await fetch(`http://localhost:8000/api/admin/shelter/${shelterId}/`, {
                method: 'PUT', // Use the PUT method to update the shelter
                headers: {
                    'Content-Type': 'application/json', // Specify the content type as JSON
                    Authorization: `Bearer ${token}`, // Include the token for authentication
                },
                body: JSON.stringify(formData), // Convert the form data to a JSON string
            });
            if (response.ok) {
                alert('Shelter updated successfully'); // Show a success alert
                navigate('/admin/shelters'); // Redirect to the admin shelters page
            } else {
                console.error('Failed to update shelter'); // Log an error if the request fails
                alert('Failed to update shelter. Please try again.'); // Show an error alert
            }
        } catch (error) {
            console.error('Error updating shelter:', error); // Handle any errors during the update process
            alert('An error occurred. Please try again.'); // Show a generic error alert
        }
    };

    if (loading) {
        return <p>Loading shelter details...</p>; // Show a loading message while fetching shelter details
    }

    return <ShelterForm initialData={initialData} onSubmit={handleSubmit} />; // Render the ShelterForm component with initial data and submit handler
}

export default EditShelter; // Export the EditShelter component