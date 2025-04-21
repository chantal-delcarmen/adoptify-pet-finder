import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel';

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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('role'); // Assume role is stored in localStorage
    if (userRole !== 'admin') {
      navigate('/'); // Redirect non-admin users to the home page
    }
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
    <div className="create-pet-page">
      <AdminPanel />
      <h2>Create a New Pet</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit} className="create-pet-form">
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Age:
          <input type="number" name="age" value={formData.age} onChange={handleChange} required />
        </label>
        <label>
          Gender:
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <label>
          Domesticated:
          <input type="checkbox" name="domesticated" checked={formData.domesticated} onChange={handleChange} />
        </label>
        <label>
          Pet Type:
          <input type="text" name="pet_type" value={formData.pet_type} onChange={handleChange} required />
        </label>
        <label>
          Shelter ID:
          <input type="number" name="shelter_id" value={formData.shelter_id} onChange={handleChange} required />
        </label>
        <label>
          Image:
          <input type="file" name="image" onChange={handleFileChange} />
        </label>
        <button type="submit" className="button button--primary">
          Create Pet
        </button>
      </form>
    </div>
  );
}

export default CreatePet;