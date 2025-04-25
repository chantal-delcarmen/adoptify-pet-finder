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

    useEffect(() => {
        fetchApplications();
    }, [navigate]);

    const handleApprove = async (applicationId) => {
        const token = localStorage.getItem('access');
        if (!token) {
            alert('You must be logged in to approve an application.');
            navigate('/login');
            return;
        }

        try {
            // Send a PATCH request to update the application status
            const response = await fetch(`http://localhost:8000/api/adoption-application/${applicationId}/update-status/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ application_status: 'Approved' }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Application approved:', data);

                // Ensure pet_id is retrieved correctly
                const petId = data.pet_id;
                if (!petId) {
                    console.error('Pet ID is missing in the response.');
                    alert('Failed to update pet status. Please try again.');
                    return;
                }

                // Update the pet's status to "Adopted"
                const petResponse = await fetch(`http://localhost:8000/api/pets/${petId}/`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ adoption_status: 'Adopted' }),
                });

                if (petResponse.ok) {
                    console.log('Pet status updated to Adopted.');
                    setSelectedApplication(null); // Close the modal
                    fetchApplications(); // Refresh the list of applications
                    alert('Application approved successfully!');
                    navigate('/admin/applications'); // Redirect after refreshing
                } else {
                    console.error('Failed to update pet status.');
                    alert('Failed to update pet status. Please try again.');
                }
            } else {
                console.error('Failed to approve application.');
                alert('Failed to approve application. Please try again.');
            }
        } catch (err) {
            console.error('Error approving application:', err);
            alert('An error occurred. Please try again.');
        }
    };

    const handleReject = async (applicationId) => {
        const token = localStorage.getItem('access');
        if (!token) {
            alert('You must be logged in to reject an application.');
            navigate('/login');
            return;
        }

        try {
            // Send a PATCH request to update the application status
            const response = await fetch(`http://localhost:8000/api/adoption-application/${applicationId}/update-status/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ application_status: 'Rejected' }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Application rejected:', data);

                // Ensure pet_id is retrieved correctly
                const petId = data.pet_id;
                if (!petId) {
                    console.error('Pet ID is missing in the response.');
                    alert('Failed to update pet status. Please try again.');
                    return;
                }

                // Update the pet's status to "Available"
                const petResponse = await fetch(`http://localhost:8000/api/pets/${petId}/`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ adoption_status: 'Available' }),
                });

                if (petResponse.ok) {
                    console.log('Pet status updated to Available.');
                    setSelectedApplication(null); // Close the modal
                    fetchApplications(); // Refresh the list of applications
                    alert('Application rejected successfully!');
                    navigate('/admin/applications'); // Redirect after refreshing
                } else {
                    console.error('Failed to update pet status.');
                    alert('Failed to update pet status. Please try again.');
                }
            } else {
                console.error('Failed to reject application.');
                alert('Failed to reject application. Please try again.');
            }
        } catch (err) {
            console.error('Error rejecting application:', err);
            alert('An error occurred. Please try again.');
        }
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
                            <div className="application-card-container">
                                <ApplicationCard application={application} />
                                <ViewDetailsButton 
                                    key={application.application_id}
                                    onClick={() => handleCardClick(application)} // Open modal on click
                                />
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