import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Donations() {
    const [shelters, setShelters] = useState([]);
    const [selectedShelter, setSelectedShelter] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShelters = async () => {
            const token = localStorage.getItem('access');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/admin/shelters/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched shelters:', data); // Debug log
                    setShelters(data);
                } else {
                    setError('Failed to load shelters. Please try again later.');
                }
            } catch (err) {
                setError('Failed to load shelters. Please try again later.');
            }
        };

        fetchShelters();
    }, [navigate]);

    const handleDonate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const token = localStorage.getItem('access');
        if (!token) {
            navigate('/login');
            return;
        }

        if (!selectedShelter || !amount) {
            setError('Please select a shelter and enter a donation amount.');
            return;
        }

        console.log('Sending data:', { shelter_id: selectedShelter, amount: parseFloat(amount) }); // Debug log

        try {
            const response = await fetch('http://localhost:8000/api/donate/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    shelter_id: selectedShelter, // Use selectedShelter directly
                    amount: parseFloat(amount),
                }),
            });

            if (response.ok) {
                setSuccess('Thank you for your donation!');
                setAmount('');
                setSelectedShelter('');
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to process donation. Please try again.');
            }
        } catch (err) {
            setError('Failed to process donation. Please try again.');
        }
    };

    return (
        <div className="donations-page">
            <Navbar />
            
            <h1>Make a Donation</h1>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleDonate}>
                <div>
                    <label htmlFor="shelter">Select Shelter:</label>
                    <select
                        id="shelter"
                        value={selectedShelter}
                        onChange={(e) => setSelectedShelter(e.target.value)}
                    >
                        <option value="">-- Select a Shelter --</option>
                        {shelters.map((shelter) => (
                            <option key={shelter.shelter_id} value={shelter.shelter_id}> {/* Use shelter.shelter_id as the value */}
                                {shelter.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="amount">Donation Amount:</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="1"
                        step="1"
                    />
                </div>
                <button type="submit">Donate</button>
            </form>
        </div>
    );
}

export default Donations;