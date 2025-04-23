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