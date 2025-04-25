/**
 * This component uses Stripe's pre-built components and APIs for handling secure payment processing.
 * The `CardElement` is a pre-built UI component provided by Stripe for collecting credit card details.
 * The `Elements` wrapper ensures that the Stripe context is available to all child components.
 * The `useStripe` and `useElements` hooks are used to interact with Stripe's API for creating payment methods.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js'; // Import Stripe for payment processing
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'; // Import Stripe components
import Navbar from '../components/Navbar'; // Import the Navbar component

// Replace with your Stripe publishable key
const stripePromise = loadStripe('your-publishable-key-here');

function Donations() {
    const [shelters, setShelters] = useState([]); // State to store the list of shelters
    const [selectedShelter, setSelectedShelter] = useState(''); // State to store the selected shelter
    const [amount, setAmount] = useState(''); // State to store the donation amount
    const [error, setError] = useState(''); // State to store error messages
    const [success, setSuccess] = useState(''); // State to store success messages
    const navigate = useNavigate(); // Initialize navigation
    const stripe = useStripe(); // Initialize Stripe
    const elements = useElements(); // Initialize Stripe elements

    useEffect(() => {
        const fetchShelters = async () => {
            const token = localStorage.getItem('access'); // Retrieve the access token from localStorage
            if (!token) {
                alert('You need to log in first.'); // Alert the user if not authenticated
                navigate('/login'); // Redirect to login if the user is not authenticated
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/admin/shelters/', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token for authentication
                    },
                });

                if (response.ok) {
                    const data = await response.json(); // Parse the response JSON
                    setShelters(data); // Update the shelters state with the fetched data
                } else {
                    setError('Failed to load shelters. Please try again later.'); // Set an error message if the request fails
                }
            } catch (err) {
                setError('Failed to load shelters. Please try again later.'); // Handle any errors during the fetch process
            }
        };

        fetchShelters(); // Fetch the list of shelters when the component mounts
    }, [navigate]); // Dependency array ensures the effect runs when `navigate` changes

    const handleDonate = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        setError(''); // Clear any previous error messages
        setSuccess(''); // Clear any previous success messages

        if (!stripe || !elements) {
            setError('Stripe has not loaded yet. Please try again.'); // Show an error if Stripe is not ready
            return;
        }

        const cardElement = elements.getElement(CardElement); // Get the CardElement from Stripe

        try {
            const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
                type: 'card', // Specify the payment method type as "card"
                card: cardElement, // Pass the CardElement
            });

            if (stripeError) {
                setError(stripeError.message); // Set the error message if Stripe returns an error
                return;
            }

            const token = localStorage.getItem('access'); // Retrieve the access token from localStorage
            if (!token) {
                navigate('/login'); // Redirect to login if the user is not authenticated
                return;
            }

            const response = await fetch('http://localhost:8000/api/donate/', {
                method: 'POST', // Use the POST method to process the donation
                headers: {
                    'Content-Type': 'application/json', // Specify the content type as JSON
                    Authorization: `Bearer ${token}`, // Include the token for authentication
                },
                body: JSON.stringify({
                    shelter_id: selectedShelter, // Include the selected shelter ID
                    amount: parseFloat(amount), // Include the donation amount
                    payment_method_id: paymentMethod.id, // Include the payment method ID from Stripe
                }),
            });

            if (response.ok) {
                setSuccess('Thank you for your donation!'); // Show a success message
                setAmount(''); // Clear the donation amount
                setSelectedShelter(''); // Clear the selected shelter
                cardElement.clear(); // Clear the CardElement
            } else {
                const data = await response.json(); // Parse the error response JSON
                setError(data.error || 'Failed to process donation. Please try again.'); // Set an error message
            }
        } catch (err) {
            setError('Failed to process donation. Please try again.'); // Handle any errors during the donation process
        }
    };

    return (
        <>
        <Navbar /> {/* Include the Navbar component */}

        {/* Hero Section */}
        <section className="hero">
            <h2>Make a Donation</h2>
        </section>

        <Elements stripe={stripePromise}>
            <div className="donations-page">
                {error && <p className="error">{error}</p>} {/* Display error message if any */}
                {success && <p className="success">{success}</p>} {/* Display success message if any */}
                <form onSubmit={handleDonate} className="donation-form">
                    <div className="form-group">
                        <label htmlFor="shelter">Select Shelter:</label>
                        <select
                            id="shelter"
                            value={selectedShelter}
                            onChange={(e) => setSelectedShelter(e.target.value)} // Update the selected shelter
                            className="form-control"
                        >
                            <option value="">-- Select a Shelter --</option>
                            {shelters.map((shelter) => (
                                <option key={shelter.shelter_id} value={shelter.shelter_id}>
                                    {shelter.name} {/* Display the shelter name */}
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
                            onChange={(e) => setAmount(e.target.value)} // Update the donation amount
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
                                        fontSize: '16px', // Set the font size for the card input
                                        color: '#424770', // Set the text color
                                        '::placeholder': {
                                            color: '#aab7c4', // Set the placeholder text color
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146', // Set the text color for invalid input
                                    },
                                },
                            }}
                            className="card-element"
                        />
                    </div>
                    <button type="submit" disabled={!stripe} className="donate-button">
                        Donate {/* Submit button */}
                    </button>
                </form>
            </div>
        </Elements>
        </>
    );
}

export default Donations; // Export the Donations component