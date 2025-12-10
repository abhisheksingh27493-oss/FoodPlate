// Real API service - Replace with your actual backend URL
const API_BASE_URL = 'http://localhost:5000/api'; // Change this to your backend URL

const foodService = {
  getAllFoods: async () => {
    const response = await fetch(`${API_BASE_URL}/food`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch foods');
    return response.json();
  },

  createFood: async (foodData) => {
    const response = await fetch(`${API_BASE_URL}/food`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(foodData)
    });
    if (!response.ok) throw new Error('Failed to create food');
    return response.json();
  },

  updateFood: async (id, foodData) => {
    const response = await fetch(`${API_BASE_URL}/food/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(foodData)
    });
    if (!response.ok) throw new Error('Failed to update food');
    return response.json();
  },

  deleteFood: async (id) => {
    const response = await fetch(`${API_BASE_URL}/food/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete food');
    return response.json();
  }
};

export default foodService;
