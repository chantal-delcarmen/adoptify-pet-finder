export const fetchShelters = async (token) => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/shelters/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        return data.map((shelter) => ({
          id: shelter.shelter_id,
          name: shelter.name,
        }));
      } else {
        console.error('Failed to fetch shelters');
        return [];
      }
    } catch (err) {
      console.error('Error fetching shelters:', err);
      return [];
    }
  };