// Create page for updating pet details
import React, { useEffect, useState } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel'; // Import the AdminPanel for the navbar and header



function AdminUpdatePet() {
  const [pet, setPet] = useState(null); // State for the pet details
  const [error, setError] = useState(''); // State for error messages
  const [loading, setLoading] = useState(true); // State for loading status
  const [shelters, setShelters] = useState([]); // State for the list of shelters
  const [success, setSuccess] = useState(''); // State for success messages
  const navigate = useNavigate(); // Initialize navigation
  const { petId } = useParams(); // Get the pet ID from the URL parameters

  useEffect(() => {
    const fetchPetDetails = async () => {
      const token = localStorage.getItem('access');
      try {
        const response = await fetch(`http://localhost:8000/api/pets/${petId}/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPet(data);
        } else {
          setError('Failed to fetch pet details');
        }
      } catch (err) {
        setError('An error occurred while fetching pet details');
      } finally {
        setLoading(false);
      }
    };
  
    const fetchShelters = async () => {
      const token = localStorage.getItem('access');
      try {
        const response = await fetch('http://localhost:8000/api/admin/shelters/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
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
  
    fetchPetDetails();
    fetchShelters();
  }, [petId, navigate]); // Fetch pet details and shelters when the component mounts
  

  const handleUpdateClick = async () => {
    const token = localStorage.getItem('access'); // Get the admin token
    const formData = new FormData(); // Create a new FormData object to handle file uploads
      // Add basic fields
    formData.append('name', pet.name);
    formData.append('age', pet.age);
    formData.append('gender', pet.gender);
    formData.append('domesticated', pet.domesticated);
    formData.append('pet_type', pet.pet_type);
    formData.append('shelter_id', pet.shelter_id);

    if (pet.image instanceof File) {
      formData.append('image', pet.image);
    }
  
    try {
      const response = await fetch(`http://localhost:8000/api/pets/${petId}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`, // Don't set Content-Type, let browser handle it for FormData
        },
        body: formData,
      });
  
      if (response.ok) {
        navigate('/admin-view-pets');
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData); // Log the error response for debugging
        setError('Failed to update pet details');
      }
    } catch (err) {
      setError('An error occurred while updating pet details');
    }
  };

  if (loading) return <div>Loading...</div>; // Show loading message while fetching data

  return (
    <div className="admin-update-pet-page">
      <AdminPanel />
      <h1>Update Pet Details</h1>
      <form onSubmit={(e) => e.preventDefault()} className="form">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={pet.name}
          onChange={(e) => setPet({ ...pet, name: e.target.value })} // Update pet name in state
        />
        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          name="age"
          value={pet.age}
          onChange={(e) => setPet({ ...pet, age: e.target.value })} // Update pet age in state 
        />
        <label htmlFor="gender">Gender:</label>
        <select
          id="gender"
          name="gender"
          value={pet.gender}
          onChange={(e) => setPet({ ...pet, gender: e.target.value })} // Update pet gender in state
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <label htmlFor="domesticated">
          Domesticated
        <input
          type="checkbox"
          id="domesticated"
          name="domesticated"
          checked={pet.domesticated}
          onChange={(e) => setPet({ ...pet, domesticated: e.target.checked })} // Update pet domesticated status in state 
        />
        </label>
        <label htmlFor="pet_type">Pet Type:</label>
        <select
          id="pet_type"
          name="pet_type"
          value={pet.pet_type}
          onChange={(e) => setPet({ ...pet, pet_type: e.target.value })} // Update pet type in state  
        >
          <option value="">Select Pet Type</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Bird">Bird</option>
          <option value="Rabbit">Rabbit</option>
        </select>
        <label htmlFor="shelter_id">Shelter ID:</label>
        <select
          id="shelter_id"
          name="shelter_id"
          value={pet.shelter_id}
          onChange={(e) => setPet({ ...pet, shelter_id: e.target.value })} // Update pet shelter ID in state
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
        <label htmlFor="image">Current Image:</label>
        {pet.image && (
          <img
            src={
              pet.image instanceof File
                ? URL.createObjectURL(pet.image) // preview new upload
                : pet.image // full URL from backend
            }            
            alt="Pet"
            className="pet-image"
            style={{ width: '200px', height: 'auto', marginBottom: '10px' }} // Style for the image
          />)}
        <label htmlFor='image'>Image:</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={(e) => setPet({ ...pet, image: e.target.files[0] })} // Update pet image in state
        />
        <button type="button" onClick={handleUpdateClick} className="button button--primary">Update Pet</button> {/* Button to update pet details */}
        <button type="button" onClick={() => navigate('/admin-view-pets')} className="button button--secondary">Cancel</button> {/* Button to cancel and go back to pets list */}
        </form>
        {/* Show error message if any */}
        {error && <p className="error-message">{error}</p>} {/* Show error message if any */}
        {success && <p className="success-message">Pet details updated successfully!</p>} {/* Show success message if any */}
    </div>
  );
}

export default AdminUpdatePet;