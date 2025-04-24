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
                <p>Applicant ID: {application.adopter_user}</p>
            )}
        </div>
    );
}

export default ApplicationCard;