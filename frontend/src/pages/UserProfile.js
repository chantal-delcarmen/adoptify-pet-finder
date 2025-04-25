import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PetCard from '../components/PetCard'; // Import the PetCard component
import ApplicationCard from '../components/ApplicationCard'; // Import the ApplicationCard component

function UserProfile() {
    const [favourites, setFavourites] = useState([]); // State for favourited animals
    const [applications, setApplications] = useState([]); // State for user applications
    const [error, setError] = useState(''); // State for error messages
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('access'); // Retrieve the access token from localStorage
            if (!token) {
                navigate('/login'); // Redirect to login if not authenticated
                return;
            }

            try {
                // Fetch favourited animals
                const favouritesResponse = await fetch('http://localhost:8000/api/favourite/list/', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the request headers
                    },
                });

                if (favouritesResponse.ok) {
                    const favouritesData = await favouritesResponse.json(); // Parse the response JSON
                    console.log('Favourites data:', favouritesData); // Debug the response
                    setFavourites(favouritesData); // Update the favourites state
                } else {
                    console.error('Failed to fetch favourites'); // Log an error if the request fails
                }

                // Fetch user applications
                const applicationsResponse = await fetch('http://localhost:8000/api/adoption-application/list', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the request headers
                    },
                });

                if (applicationsResponse.ok) {
                    const applicationsData = await applicationsResponse.json(); // Parse the response JSON
                    console.log('Applications data:', applicationsData); // Debug the response
                    setApplications(applicationsData); // Update the applications state
                } else {
                    console.error('Failed to fetch applications'); // Log an error if the request fails
                }
            } catch (err) {
                console.error('Error fetching user data:', err); // Log any errors during the fetch process
                setError('Failed to load user data. Please try again later.'); // Set an error message
            }
        };

        fetchUserData(); // Call the function to fetch user data
    }, [navigate]); // Dependency array ensures the effect runs when `navigate` changes

    return (
        <div className="user-profile">
            <Navbar />
            
            {/* Hero Section */}
            <section className="hero">
                <h2>Your Profile</h2>
            </section>

            {/* Display error message if any */}
            {error && <p className="error-message">{error}</p>}

            {/* Favourites Section */}
            <section className="favourites-section">
                <h2>Your Favourited Animals</h2>
                {favourites.length > 0 ? (
                    <div className="favourites-grid profile-favourites-grid">
                        {favourites.map((animal) => (
                            <PetCard
                                key={animal.id} // Unique key for each PetCard
                                pet={animal.pet} // Pass the pet data to the PetCard
                                isFavorited={true} // Always true for favourites
                                onToggleFavorite={(petId) => {
                                    // Update the favourites list when toggling
                                    setFavourites((prevFavourites) =>
                                        prevFavourites.filter((fav) => fav.pet.pet_id !== petId) // Remove the pet from favourites
                                    );
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <p>You have not favourited any animals yet.</p> // Message if no favourites
                )}
            </section>

            {/* Applications Section */}
            <section className="applications-section">
                <br /><br /> {/* Add spacing between sections */}
                <h2>Your Applications</h2>
                {applications.length > 0 ? (
                    <div className="applications-grid">
                        {applications.map((application) => (
                            <div className="application-card-container">
                                <ApplicationCard 
                                    key={application.application_id} // Unique key for each ApplicationCard
                                    application={application} // Pass the application data to the ApplicationCard
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You have not submitted any applications yet.</p> // Message if no applications
                )}
            </section>
        </div>
    );
}

export default UserProfile;