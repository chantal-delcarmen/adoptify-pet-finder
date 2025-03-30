import logo from './logo.svg';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

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
    <div style={{ padding: "2rem" }}>
      <h1>Adoptify 🐾</h1>
      <p><strong>Message from backend:</strong> {message}</p>
    </div>
  );
}

export default App;
