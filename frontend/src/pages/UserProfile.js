import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; 

function UserProfile() {
    const [favorites, setFavorites] = useState([]); // State for favorited animals
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
                // Fetch favorited animals
                const favoritesResponse = await fetch('http://localhost:8000/api/user/favorites/', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (favoritesResponse.ok) {
                    const favoritesData = await favoritesResponse.json();
                    setFavorites(favoritesData);
                } else {
                    console.error('Failed to fetch favorites');
                }

                // Fetch user applications
                const applicationsResponse = await fetch('http://localhost:8000/api/user/applications/', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (applicationsResponse.ok) {
                    const applicationsData = await applicationsResponse.json();
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

            <section className="favorites-section">
                <h2>Your Favorited Animals</h2>
                {favorites.length > 0 ? (
                    <ul className="favorites-list">
                        {favorites.map((animal) => (
                            <li key={animal.id} className="favorite-item">
                                <img src={animal.image} alt={animal.name} className="animal-image" />
                                <div>
                                    <h3>{animal.name}</h3>
                                    <p>{animal.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You have not favorited any animals yet.</p>
                )}
            </section>

            <section className="applications-section">
                <h2>Your Applications</h2>
                {applications.length > 0 ? (
                    <ul className="applications-list">
                        {applications.map((application) => (
                            <li key={application.id} className="application-item">
                                <h3>{application.pet_name}</h3>
                                <p>Status: {application.status}</p>
                                <p>Submitted on: {new Date(application.submitted_at).toLocaleDateString()}</p>
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