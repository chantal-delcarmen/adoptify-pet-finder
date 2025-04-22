import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

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

    const handleRemoveFavourite = async (petId) => {
        const token = localStorage.getItem('access');
        if (!token) {
            alert('You must be logged in to remove a favourite.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/favourite/${petId}/remove/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert('Pet removed from favourites!');
                setFavourites((prevFavourites) => prevFavourites.filter((animal) => animal.pet.id !== petId));
            } else {
                console.error('Failed to remove favourite');
                alert('Failed to remove pet from favourites.');
            }
        } catch (err) {
            console.error('Error removing favourite:', err);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="user-profile">
            <Navbar />
            <h1>Your Profile</h1>

            {error && <p className="error-message">{error}</p>}

            <section className="favourites-section">
                <h2>Your Favourited Animals</h2>
                {favourites.length > 0 ? (
                    <ul className="favourites-list">
                        {favourites.map((animal) => (
                            <li key={animal.id} className="favourite-item">
                                <img src={animal.pet.image} alt={animal.pet.name} className="animal-image" />
                                <div>
                                    <h3>{animal.pet.name}</h3>
                                    <p>{animal.pet.description}</p>
                                    <button
                                        className="remove-favourite-button"
                                        onClick={() => handleRemoveFavourite(animal.pet.id)}
                                    >
                                        Remove from Favourites
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
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