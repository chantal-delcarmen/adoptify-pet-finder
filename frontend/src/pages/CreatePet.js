import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel'; // Import the AdminPanel component for the admin navbar
import PetForm from '../components/PetForm'; // Import the PetForm component for creating or editing pets
import { fetchShelters } from '../utils/FetchShelters'; // Import the fetchShelters utility function
import { refreshAccessToken } from '../utils/AuthUtils'; // Import the token refresh utility function

function CreatePet() {
  const [shelters, setShelters] = useState([]); // State to store the list of shelters
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const userRole = localStorage.getItem('role'); // Retrieve the user's role from localStorage
    if (userRole !== 'admin') {
      navigate('/'); // Redirect non-admin users to the home page
    }

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

      // Fetch shelters using the utility function
      const sheltersData = await fetchShelters(token);
      setShelters(sheltersData); // Update the shelters state with the fetched data
    };

    fetchSheltersData(); // Fetch the list of shelters when the component mounts
  }, [navigate]); // Dependency array ensures the effect runs when `navigate` changes

  const handleCreatePet = async (formData) => {
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
      if (key === 'image' && !formData.image) {
        return; // Skip the image field if no new image is selected
      }
      formDataToSend.append(key, formData[key]); // Append each form field to the FormData object
    });

    try {
      const response = await fetch('http://localhost:8000/api/register-pet/', {
        method: 'POST', // Use the POST method to create a new pet
        headers: { Authorization: `Bearer ${token}` }, // Include the token for authentication
        body: formDataToSend, // Send the FormData object as the request body
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response JSON
        console.error('Error response:', errorData); // Log the error response
        throw new Error(errorData.detail || 'Failed to create pet'); // Throw an error with the response message
      }

      alert('Pet created successfully!'); // Show a success alert
      navigate('/admin-view-pets'); // Redirect to the admin view pets page
    } catch (error) {
      console.error('Error creating pet:', error); // Log any errors during the creation process
      alert(error.message || 'An error occurred while creating the pet.'); // Show an error alert
    }
  };

  return (
    <div>
      <AdminPanel /> {/* Include the AdminPanel component for the admin navbar */}
      <h2>Create a New Pet</h2> {/* Page heading */}
      <PetForm initialData={null} onSubmit={handleCreatePet} shelters={shelters} /> {/* PetForm component */}
    </div>
  );
}

export default CreatePet;