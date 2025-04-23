import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function EditPet() {
    const [searchParams] = useSearchParams();
    const petId = searchParams.get('petId'); // Get the petId from the query string
    const [petData, setPetData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPetData = async () => {
            try {
                const token = localStorage.getItem('access'); // Get the token from localStorage
                if (!token) {
                    alert('You must be logged in to edit a pet.');
                    navigate('/login'); // Redirect to login if not authenticated
                    return;
                }

                const response = await fetch(`http://localhost:8000/api/pets/${petId}/`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the request
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPetData(data);
                } else {
                    setError('Failed to fetch pet data.');
                }
            } catch (err) {
                setError('An error occurred while fetching pet data.');
            }
        };

        if (petId) {
            fetchPetData();
        }
    }, [petId, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPetData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access');
            if (!token) {
                alert('You must be logged in to edit a pet.');
                return;
            }

            const response = await fetch(`http://localhost:8000/api/pets/${petId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(petData),
            });

            if (response.ok) {
                alert('Pet details updated successfully!');
                navigate('/admin/pets'); // Redirect to the admin pets page
            } else {
                const data = await response.json();
                console.error('Error updating pet:', data);
                alert(data.message || 'Failed to update pet details.');
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            alert('An error occurred. Please try again.');
        }
    };

    if (!petId) {
        return <p>Invalid pet ID.</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!petData) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Edit Pet: {petData.name}</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={petData.name}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Gender:
                    <select
                        name="gender"
                        value={petData.gender}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </label>
                <label>
                    Age:
                    <input
                        type="number"
                        name="age"
                        value={petData.age}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Domesticated:
                    <select
                        name="domesticated"
                        value={petData.domesticated ? 'Yes' : 'No'}
                        onChange={(e) =>
                            handleInputChange({
                                target: {
                                    name: 'domesticated',
                                    value: e.target.value === 'Yes',
                                },
                            })
                        }
                        required
                    >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </label>
                <label>
                    Type:
                    <input
                        type="text"
                        name="pet_type"
                        value={petData.pet_type}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Status:
                    <select
                        name="adoption_status"
                        value={petData.adoption_status}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="Available">Available</option>
                        <option value="Pending">Pending</option>
                        <option value="Adopted">Adopted</option>
                    </select>
                </label>
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={petData.description}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default EditPet;