import React from 'react';

export const EditButton = ({ onClick }) => (
    <button className="button button--warning" onClick={onClick}>
        Edit
    </button>
);

export const AddButton = ({ onClick, children = 'Add' }) => (
    <button className="button button--success" onClick={onClick}>
        {children}
    </button>
);

export const RemoveButton = ({ onClick }) => (
    <button className="button button--danger" onClick={onClick}>
        Remove
    </button>
);

export const ApproveButton = ({ onClick }) => (
    <button className="button button--success" onClick={onClick}>
        Approve
    </button>
);

export const RejectButton = ({ onClick }) => (
    <button className="button button--danger" onClick={onClick}>
        Reject
    </button>
);

export const ViewDetailsButton = ({ onClick }) => (
    <button className="button button--primary" onClick={onClick}>
        View Details
    </button>
);