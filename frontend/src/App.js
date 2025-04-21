import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/main.scss';

// Pages Routes
import Home from './pages/Home';
import Signup from './pages/Signup';
import LoginPage from './pages/LoginPage';
import Apply from './pages/Apply';
import Pets from './pages/Pets';
import CreatePet from './pages/CreatePet';
import AdminDashboard from './pages/AdminDashboard';
import AdminViewPets from './pages/AdminViewPets';
import LogoutPage from './pages/LogoutPage';
import UserProfile from './pages/UserProfile';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log("🔍 React env URL:", process.env.REACT_APP_API_URL);
    axios.get(`${process.env.REACT_APP_API_URL}test/`)
      .then(res => setMessage(res.data.message))
      .catch(err => {
        console.error("❌ Failed to fetch backend:", err);
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
        <Route path="/pets" element={<Pets />} />
        <Route path="/create-pet" element={<CreatePet />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-view-pets" element={<AdminViewPets />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
