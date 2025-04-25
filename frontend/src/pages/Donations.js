import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Navbar from '../components/Navbar';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('your-publishable-key-here');

function Donations() {
    const [shelters, setShelters] = useState([]);
    const [selectedShelter, setSelectedShelter] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();

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

        if (!stripe || !elements) {
            setError('Stripe has not loaded yet. Please try again.');
            return;
        }

        const cardElement = elements.getElement(CardElement);

        try {
            const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (stripeError) {
                setError(stripeError.message);
                return;
            }

            const token = localStorage.getItem('access');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:8000/api/donate/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    shelter_id: selectedShelter,
                    amount: parseFloat(amount),
                    payment_method_id: paymentMethod.id,
                }),
            });

            if (response.ok) {
                setSuccess('Thank you for your donation!');
                setAmount('');
                setSelectedShelter('');
                cardElement.clear();
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to process donation. Please try again.');
            }
        } catch (err) {
            setError('Failed to process donation. Please try again.');
        }
    };

    return (
        <>
        <Navbar />

        {/* Hero Section */}
        <section className="hero">
            <h2>Make a Donation</h2>
        </section>

        <Elements stripe={stripePromise}>
            <div className="donations-page">
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <form onSubmit={handleDonate} className="donation-form">
                    <div className="form-group">
                        <label htmlFor="shelter">Select Shelter:</label>
                        <select
                            id="shelter"
                            value={selectedShelter}
                            onChange={(e) => setSelectedShelter(e.target.value)}
                            className="form-control"
                        >
                            <option value="">-- Select a Shelter --</option>
                            {shelters.map((shelter) => (
                                <option key={shelter.shelter_id} value={shelter.shelter_id}>
                                    {shelter.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">Donation Amount:</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            min="1"
                            step="1"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Credit Card Details:</label>
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}
                            className="card-element"
                        />
                    </div>
                    <button type="submit" disabled={!stripe} className="donate-button">
                        Donate
                    </button>
                </form>
            </div>
        </Elements>
        </>
    );
}

export default Donations;