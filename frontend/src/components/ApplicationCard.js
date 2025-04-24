import React from 'react';

function ApplicationCard({ application, isAdmin, isModal }) {
    return (
        <div className={`application-card ${isModal ? 'application-card--modal' : ''}`}>
            {/* Fields for both modal and non-modal views */}
            <h3>{application.pet_name || 'Unknown Pet'}</h3>
            <p>Status: {application.application_status || 'Unknown'}</p>
            <p>
                Submitted on:{' '}
                {application.submission_date
                    ? new Date(application.submission_date).toLocaleDateString()
                    : 'Unknown Date'}
            </p>
            {isAdmin && application.adopter_user && (
                <p>
                    <b>Applicant Name:</b> {application.adopter_user.first_name} {application.adopter_user.last_name}
                </p>
            )}
            <p><b>Application ID:</b> {application.application_id || 'Unknown'}</p>

            {/* Additional fields for modal view only */}
            {isModal && (
                <>
                    <p><b>Pet ID:</b> {application.pet_id || 'Unknown'}</p>
                    <p><b>Additional Details:</b> {application.message || 'No details provided'}</p>
                </>
            )}
        </div>
    );
}

export default ApplicationCard;