import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PetCard from '../components/PetCard'; // Import the PetCard component

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
                    console.log('Raw Applications Data:', applicationsData);

                    // Get unique pet IDs
                    const petIds = [...new Set(applicationsData.map(app => app.pet_id))];

                    // Fetch all pet details in parallel
                    const petFetches = await Promise.all(
                        petIds.map(id =>
                            fetch(`http://localhost:8000/api/pets/${id}/`, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }).then(res => res.ok ? res.json() : null)
                        )
                    );

                    const petMap = {};
                    petFetches.forEach((pet, index) => {
                        if (pet) {
                          petMap[index] = pet; // Map pet ID to pet object
                        }
                      });
                    console.log('Pet Fetches:', petFetches); // Debug the pet fetches
                    console.log('Pet Map:', petMap); // Debug the pet map   
                    
                    // Merge pet name into each application
                    const enrichedApplications = applicationsData.map((app, index) => ({
                        ...app,
                        pet_name: petFetches[index]?.name || 'Unknown Pet',
                        pet_image: petMap[index]?.image || '',
                    }));
                    console.log('Enriched Applications Data:', enrichedApplications);
                    setApplications(enrichedApplications);
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
                                image={animal.pet.image}
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
                    <ul className="applications-list">
                        {applications.map((application) => (
                            <li key={application.id} className="application-item">
                                <h3>{application.pet_name}</h3>
                                <p>Status: {application.application_status}</p>
                                <p>Submitted on: {new Date(application.submission_date).toLocaleDateString()}</p>
                                <img src={application.pet_image} alt={application.pet_name} className="pet-image" />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You have not submitted any applications yet.</p>
                )}
            </section>
        </div>
    );
}

export default UserProfile;