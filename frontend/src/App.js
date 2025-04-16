import { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/main.scss';
import Home from './pages/Home';

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
    <div>
      <Home message={message} />
    </div>
  );
}

export default App;
