import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ApplicationCard from '../components/ApplicationCard'; // Import the ApplicationCard component
import AdminPanel from '../components/AdminPanel';

function ManageApplications() {
    const [applications, setApplications] = useState([]); // State for all applications
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            const token = localStorage.getItem('access');
            if (!token) {
                navigate('/login'); // Redirect to login if not authenticated
                return;
            }

            try {
                // Fetch all adoption applications
                const response = await fetch('http://localhost:8000/api/adoption-application/list/', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Applications data:', data); // Debug the response
                    setApplications(data);
                } else {
                    console.error('Failed to fetch applications');
                    setError('Failed to load applications. Please try again later.');
                }
            } catch (err) {
                console.error('Error fetching applications:', err);
                setError('Failed to load applications. Please try again later.');
            }
        };

        fetchApplications();
    }, [navigate]);

    return (
        <div className="manage-applications">
            <AdminPanel />
            <h1>Manage Adoption Applications</h1>

            {error && <p className="error-message">{error}</p>}

            <section className="applications-section">
                <h2>All Applications</h2>
                {applications.length > 0 ? (
                    <div className="applications-grid">
                        {applications.map((application) => (
                            <ApplicationCard
                                key={application.application_id}
                                application={application}
                                isAdminView={true} // Pass a prop to indicate admin view
                            />
                        ))}
                    </div>
                ) : (
                    <p>No adoption applications found.</p>
                )}
            </section>
        </div>
    );
}

export default ManageApplications;