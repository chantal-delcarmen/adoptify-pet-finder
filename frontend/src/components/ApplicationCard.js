import React from 'react';

function ApplicationCard({ application, isAdmin }) {
    return (
        <div className="application-card">
            <h3>{application.pet_name || 'Unknown Pet'}</h3>
            <p>Status: {application.application_status || 'Unknown'}</p>
            <p>
                Submitted on:{' '}
                {application.submission_date
                    ? new Date(application.submission_date).toLocaleDateString()
                    : 'Unknown Date'}
            </p>
            {isAdmin && application.adopter_user && (
                <div>
                    <p><b>Applicant Name: {application.adopter_user.first_name} {application.adopter_user.last_name}</b></p>
                    <p><b>Application ID: {application.application_id || 'Unknown'}</b></p> {/* Display application ID */}
                </div>
            )}
        </div>
    );
}

export default ApplicationCard;