import React from 'react';

function ApplicationCard({ application, isModal }) {
    return (
        <div className={`application-card ${isModal ? 'application-card--modal' : ''}`}>
            {/* Fields for both modal and non-modal views */}
            <h3>{application.pet_name || 'Unknown Pet'}</h3>
            <p><b>Application Status: {application.application_status || 'Unknown'}</b></p>
            <p>
                Submitted on:{' '}
                {application.submission_date
                    ? new Date(application.submission_date).toLocaleDateString()
                    : 'Unknown Date'}
            </p>
            {application.adopter_user && (
                <p>
                    Applicant Name: {application.adopter_user.first_name} {application.adopter_user.last_name}
                </p>
            )}
            <p>Application ID: {application.application_id || 'Unknown'}</p>

            {/* Additional fields for modal view only */}
            {isModal && (
                <>
                    <p>Pet ID: {application.pet_id || 'Unknown'}</p>
                    <p>Additional Details: {application.message || 'No details provided'}</p>
                </>
            )}
        </div>
    );
}

export default ApplicationCard;