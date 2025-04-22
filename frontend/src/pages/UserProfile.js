import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PetCard from '../components/PetCard'; // Import the PetCard component
import ApplicationCard from '../components/ApplicationCard'; // Import the ApplicationCard component

function UserProfile() {
    const [favourites, setFavourites] = useState([]); // State for favourited animals
    const [applications, setApplications] = useState([]); // State for user applications
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('access');
            if (!token) {
                navigate('/login'); // Redirect to login if not authenticated
                return;
            }

            try {
                // Fetch favourited animals
                const favouritesResponse = await fetch('http://localhost:8000/api/favourite/list/', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (favouritesResponse.ok) {
                    const favouritesData = await favouritesResponse.json();
                    console.log('Favourites data:', favouritesData); // Debug the response
                    setFavourites(favouritesData);
                } else {
                    console.error('Failed to fetch favourites');
                }

                // Fetch user applications
                const applicationsResponse = await fetch('http://localhost:8000/api/adoption-application/list', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (applicationsResponse.ok) {
                    const applicationsData = await applicationsResponse.json();
                    console.log('Applications data:', applicationsData); // Debug the response
                    setApplications(applicationsData);
                } else {
                    console.error('Failed to fetch applications');
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to load user data. Please try again later.');
            }
        };

        fetchUserData();
    }, [navigate]);

    return (
        <div className="user-profile">
            <Navbar />
            <h1>Your Profile</h1>

            {error && <p className="error-message">{error}</p>}

            <section className="favourites-section">
                <h2>Your Favourited Animals</h2>
                {favourites.length > 0 ? (
                    <div className="favourites-grid profile-favourites-grid">
                        {favourites.map((animal) => (
                            <PetCard
                                key={animal.id}
                                pet={animal.pet}
                                isFavorited={true} // Always true for favourites
                                onToggleFavorite={(petId) => {
                                    // Update the favourites list when toggling
                                    setFavourites((prevFavourites) =>
                                        prevFavourites.filter((fav) => fav.pet.pet_id !== petId)
                                    );
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <p>You have not favourited any animals yet.</p>
                )}
            </section>

            <section className="applications-section">
                <h2>Your Applications</h2>
                {applications.length > 0 ? (
                    <div className="applications-grid">
                        {applications.map((application) => (
                            <ApplicationCard key={application.application_id} application={application} />
                        ))}
                    </div>
                ) : (
                    <p>You have not submitted any applications yet.</p>
                )}
            </section>
        </div>
    );
}

export default UserProfile;