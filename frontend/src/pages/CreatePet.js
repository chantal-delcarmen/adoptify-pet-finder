import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function CreatePet() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    domesticated: false,
    pet_type: '',
    shelter_id: '',
    image: null,
  });
  const [shelters, setShelters] = useState([]); // State to store the list of shelters
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('role'); // Assume role is stored in localStorage
    if (userRole !== 'admin') {
      navigate('/'); // Redirect non-admin users to the home page
    }

    // Fetch the list of shelters
    const fetchShelters = async () => {
      const token = localStorage.getItem('access'); // Use 'access' to get token
      console.log('Token:', token); // Verify the token is being retrieved
      try {
        const response = await fetch('http://localhost:8000/api/admin/shelters/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Include token for authentication
          },
        });
        if (response.ok) {
          const data = await response.json();
          const formattedShelters = data.map((shelter) => ({
            id: shelter.shelter_id,
            name: shelter.name,
          }));
          setShelters(formattedShelters);
        } else {
          console.error('Failed to fetch shelters');
        }
      } catch (err) {
        console.error('Error fetching shelters:', err);
      }
    };

    fetchShelters();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch('http://localhost:8000/api/register-pet/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token for admin authentication
        },
        body: formDataToSend,
      });

      if (response.ok) {
        setSuccess('Pet created successfully!');
        setError('');
        navigate('/pets'); // Redirect to the pets page
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create pet');
        setSuccess('');
      }
    } catch (err) {
      setError('An error occurred while creating the pet');
      setSuccess('');
    }
  };

  return (
    <div>
      <AdminPanel /> {/* Include the AdminPanel for the navbar and header */}
      <div className="form-page">
        <h1>Create a New Pet</h1>
        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />

          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <label htmlFor="domesticated">Domesticated:</label>
          <input
            type="checkbox"
            id="domesticated"
            name="domesticated"
            checked={formData.domesticated}
            onChange={handleChange}
          />

          <label htmlFor="pet_type">Pet Type:</label>
          <select
            id="pet_type"
            name="pet_type"
            value={formData.pet_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Pet Type</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Rabbit">Rabbit</option>
          </select>

          <label htmlFor="shelter_id">Shelter:</label>
          <select
            id="shelter_id"
            name="shelter_id"
            value={formData.shelter_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Shelter</option>
            {shelters.map((shelter) => {
              console.log(shelter); // Log each shelter object
              return (
                <option key={shelter.id} value={shelter.id}>
                  {shelter.name}
                </option>
              );
            })}
          </select>

          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
          />

          <button type="submit" className="button button--primary">
            Create Pet
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
}

export default CreatePet;