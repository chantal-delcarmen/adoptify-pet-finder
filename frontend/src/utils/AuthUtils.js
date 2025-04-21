export const refreshAccessToken = async (navigate) => {
  const refreshToken = localStorage.getItem('refresh');
  try {
    const response = await fetch('http://localhost:8000/api/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access', data.access); // Update the access token
      return data.access;
    } else {
      console.error('Failed to refresh token');
      localStorage.clear(); // Clear stored tokens and user data
      navigate('/login'); // Redirect to the login page
    }
  } catch (err) {
    console.error('Error refreshing token:', err);
    localStorage.clear();
    navigate('/login');
  }
};