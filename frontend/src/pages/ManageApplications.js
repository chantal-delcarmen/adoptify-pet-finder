import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationCard from '../components/ApplicationCard'; // Import the ApplicationCard component
import AdminPanel from '../components/AdminPanel'; // Import the AdminPanel component for the admin navbar
import { ViewDetailsButton, ApproveButton, RejectButton } from '../components/Buttons'; // Import buttons for actions

function ManageApplications() {
    const [applications, setApplications] = useState([]); // State for all applications
    const [selectedApplication, setSelectedApplication] = useState(null); // State for the selected application
    const [error, setError] = useState(''); // State for error messages
    const navigate = useNavigate(); // Initialize navigation

    const fetchApplications = async () => {
        const token = localStorage.getItem('access'); // Retrieve the access token from localStorage
        if (!token) {
            navigate('/login'); // Redirect to login if not authenticated
            return;
        }

        try {
            // Fetch all adoption applications
            const response = await fetch('http://localhost:8000/api/adoption-application/list/', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token for authentication
                },
            });

            if (response.ok) {
                const data = await response.json(); // Parse the response JSON
                setApplications(data); // Update the applications state with the fetched data
            } else {
                setError('Failed to load applications. Please try again later.'); // Set an error message if the request fails
            }
        } catch (err) {
            setError('Failed to load applications. Please try again later.'); // Handle any errors during the fetch process
        }
    };

    useEffect(() => {
        fetchApplications(); // Fetch the list of applications when the component mounts
    }, [navigate]); // Dependency array ensures the effect runs when `navigate` changes

    const handleApprove = async (applicationId) => {
        const token = localStorage.getItem('access'); // Retrieve the access token from localStorage
        if (!token) {
            alert('You must be logged in to approve an application.'); // Alert if the user is not logged in
            navigate('/login'); // Redirect to login
            return;
        }

        try {
            // Send a PATCH request to update the application status
            const response = await fetch(`http://localhost:8000/api/adoption-application/${applicationId}/update-status/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json', // Specify the content type as JSON
                    Authorization: `Bearer ${token}`, // Include the token for authentication
                },
                body: JSON.stringify({ application_status: 'Approved' }), // Update the application status to "Approved"
            });

            if (response.ok) {
                const data = await response.json(); // Parse the response JSON
                console.log('Application approved:', data); // Log the success response

                // Ensure pet_id is retrieved correctly
                const petId = data.pet_id; // Extract the pet ID from the response
                if (!petId) {
                    console.error('Pet ID is missing in the response.'); // Log an error if the pet ID is missing
                    alert('Failed to update pet status. Please try again.'); // Show an error alert
                    return;
                }

                // Update the pet's status to "Adopted"
                const petResponse = await fetch(`http://localhost:8000/api/pets/${petId}/`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json', // Specify the content type as JSON
                        Authorization: `Bearer ${token}`, // Include the token for authentication
                    },
                    body: JSON.stringify({ adoption_status: 'Adopted' }), // Update the pet's adoption status to "Adopted"
                });

                if (petResponse.ok) {
                    console.log('Pet status updated to Adopted.'); // Log the success response
                    setSelectedApplication(null); // Close the modal
                    fetchApplications(); // Refresh the list of applications
                    alert('Application approved successfully!'); // Show a success alert
                    navigate('/admin/applications'); // Redirect after refreshing
                } else {
                    console.error('Failed to update pet status.'); // Log an error if the request fails
                    alert('Failed to update pet status. Please try again.'); // Show an error alert
                }
            } else {
                console.error('Failed to approve application.'); // Log an error if the request fails
                alert('Failed to approve application. Please try again.'); // Show an error alert
            }
        } catch (err) {
            console.error('Error approving application:', err); // Handle any errors during the approval process
            alert('An error occurred. Please try again.'); // Show a generic error alert
        }
    };

    const handleReject = async (applicationId) => {
        const token = localStorage.getItem('access'); // Retrieve the access token from localStorage
        if (!token) {
            alert('You must be logged in to reject an application.'); // Alert if the user is not logged in
            navigate('/login'); // Redirect to login
            return;
        }

        try {
            // Send a PATCH request to update the application status
            const response = await fetch(`http://localhost:8000/api/adoption-application/${applicationId}/update-status/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json', // Specify the content type as JSON
                    Authorization: `Bearer ${token}`, // Include the token for authentication
                },
                body: JSON.stringify({ application_status: 'Rejected' }), // Update the application status to "Rejected"
            });

            if (response.ok) {
                const data = await response.json(); // Parse the response JSON
                console.log('Application rejected:', data); // Log the success response

                // Ensure pet_id is retrieved correctly
                const petId = data.pet_id; // Extract the pet ID from the response
                if (!petId) {
                    console.error('Pet ID is missing in the response.'); // Log an error if the pet ID is missing
                    alert('Failed to update pet status. Please try again.'); // Show an error alert
                    return;
                }

                // Update the pet's status to "Available"
                const petResponse = await fetch(`http://localhost:8000/api/pets/${petId}/`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json', // Specify the content type as JSON
                        Authorization: `Bearer ${token}`, // Include the token for authentication
                    },
                    body: JSON.stringify({ adoption_status: 'Available' }), // Update the pet's adoption status to "Available"
                });

                if (petResponse.ok) {
                    console.log('Pet status updated to Available.'); // Log the success response
                    setSelectedApplication(null); // Close the modal
                    fetchApplications(); // Refresh the list of applications
                    alert('Application rejected successfully!'); // Show a success alert
                    navigate('/admin/applications'); // Redirect after refreshing
                } else {
                    console.error('Failed to update pet status.'); // Log an error if the request fails
                    alert('Failed to update pet status. Please try again.'); // Show an error alert
                }
            } else {
                console.error('Failed to reject application.'); // Log an error if the request fails
                alert('Failed to reject application. Please try again.'); // Show an error alert
            }
        } catch (err) {
            console.error('Error rejecting application:', err); // Handle any errors during the rejection process
            alert('An error occurred. Please try again.'); // Show a generic error alert
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
            <AdminPanel /> {/* Include the AdminPanel component for the admin navbar */}
            <h2>Manage Adoption Applications</h2> {/* Page heading */}

            {error && <p className="error-message">{error}</p>} {/* Display error message if any */}

            <section className="applications-section">
                <p>Click on card to view details and to approve or reject an application</p>
                {applications.length > 0 ? (
                    <div className="applications-grid">
                        {applications.map((application) => (
                            <div className="application-card-container">
                                <ApplicationCard application={application} /> {/* Render the ApplicationCard component */}
                                <ViewDetailsButton 
                                    key={application.application_id}
                                    onClick={() => handleCardClick(application)} // Open modal on click
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No adoption applications found.</p> // Message if no applications are available
                )}
            </section>

            {/* Modal for showing application details */}
            {selectedApplication && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="modal-close" onClick={handleCloseModal}>
                            &times; {/* Close button */}
                        </button>
                        <div className="modal-body">
                            <ApplicationCard application={selectedApplication} isModal={true} /> {/* Render the ApplicationCard in modal */}
                        </div>
                        <div className="modal-actions">
                            <RejectButton onClick={() => handleReject(selectedApplication.application_id)} /> {/* Reject button */}
                            <ApproveButton onClick={() => handleApprove(selectedApplication.application_id)} /> {/* Approve button */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageApplications; // Export the ManageApplications component