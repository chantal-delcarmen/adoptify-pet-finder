import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationCard from '../components/ApplicationCard'; // Import the ApplicationCard component
import AdminPanel from '../components/AdminPanel';
import { ViewDetailsButton, ApproveButton, RejectButton } from '../components/Buttons'; // Import buttons

function ManageApplications() {
    const [applications, setApplications] = useState([]); // State for all applications
    const [selectedApplication, setSelectedApplication] = useState(null); // State for the selected application
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
                    setApplications(data);
                } else {
                    setError('Failed to load applications. Please try again later.');
                }
            } catch (err) {
                setError('Failed to load applications. Please try again later.');
            }
        };

        fetchApplications();
    }, [navigate]);

    const handleApprove = (applicationId) => {
        console.log(`Approved application with ID: ${applicationId}`);
        // Add logic to approve the application
    };

    const handleReject = (applicationId) => {
        console.log(`Rejected application with ID: ${applicationId}`);
        // Add logic to reject the application
    };

    const handleCardClick = (application) => {
        setSelectedApplication(application); // Set the selected application to show in the modal
    };

    const handleCloseModal = () => {
        setSelectedApplication(null); // Clear the selected application to close the modal
    };

    return (
        <div className="manage-applications">
            <AdminPanel />
            <h1>Manage Adoption Applications</h1>

            {error && <p className="error-message">{error}</p>}

            <section className="applications-section">
                <h2>All Applications</h2>
                <p>Click on card to view details and to approve or reject an application</p>
                {applications.length > 0 ? (
                    <div className="applications-grid">
                        {applications.map((application) => (
                            <div className="application-card-container" // Container for each application card
                                key={application.application_id}
                                onClick={() => handleCardClick(application)} // Open modal on click
                            >
                                <ApplicationCard application={application} />
                                <ViewDetailsButton />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No adoption applications found.</p>
                )}
            </section>

            {/* Modal for showing application details */}
            {selectedApplication && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="modal-close" onClick={handleCloseModal}>
                            &times;
                        </button>
                        <div className="modal-body">
                            <ApplicationCard application={selectedApplication} isModal={true} />
                        </div>
                        <div className="modal-actions">
                            <RejectButton onClick={() => handleReject(selectedApplication.application_id)} />
                            <ApproveButton onClick={() => handleApprove(selectedApplication.application_id)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageApplications;