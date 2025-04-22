import React from 'react';

function ApplicationCard({ application }) {
    return (
        <div className="application-card">
            <h3>{application.pet_name || 'Unknown Pet'}</h3> {/* Display pet_name */}
            <p>Status: {application.application_status || 'Unknown'}</p> {/* Display application_status */}
            <p>
                Submitted on:{' '}
                {application.submission_date
                    ? new Date(application.submission_date).toLocaleDateString()
                    : 'Unknown Date'} {/* Correctly parse submission_date */}
            </p>
        </div>
    );
}

export default ApplicationCard;