import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/main.scss';

// Stripe imports
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Pages Routes
import Home from './pages/Home';
import Signup from './pages/Signup';
import LoginPage from './pages/LoginPage';
import Apply from './pages/Apply';
import ViewPets from './pages/ViewPets';
import CreatePet from './pages/CreatePet';
import AdminDashboard from './pages/AdminDashboard';
import AdminViewPets from './pages/AdminViewPets';
import LogoutPage from './pages/LogoutPage';
import UserProfile from './pages/UserProfile';
import EditPet from './pages/EditPet';
import ManageShelters from './pages/ManageShelters';
import CreateShelter from './pages/CreateShelter';
import EditShelter from './pages/EditShelter';
import ManageApplications from './pages/ManageApplications';
import Donations from './pages/Donations';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('your-publishable-key-here');

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log("React env URL:", process.env.REACT_APP_API_URL);
    axios.get(`${process.env.REACT_APP_API_URL}test/`)
      .then(res => setMessage(res.data.message))
      .catch(err => {
        console.error("Failed to fetch backend:", err);
        setMessage("Error reaching backend.");
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home message={message} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/pets" element={<ViewPets />} />
        <Route path="/create-pet" element={<CreatePet />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-view-pets" element={<AdminViewPets />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/edit-pet" element={<EditPet />} />
        <Route path="/admin/shelters" element={<ManageShelters />} />
        <Route path="/admin/add-shelter" element={<CreateShelter />} />
        <Route path="/admin/edit-shelter/:shelterId" element={<EditShelter />} />
        <Route path="/admin/applications" element={<ManageApplications />} />
        {/* Wrap Donations in the Elements provider */}
        <Route
          path="/donations"
          element={
            <Elements stripe={stripePromise}>
              <Donations />
            </Elements>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
