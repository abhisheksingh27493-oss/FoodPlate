import axiosInstance from './axios';

const foodService = {
  getAllFoods: async () => {
    try {
      const response = await axiosInstance.get('/food');
      return response.data; // Axios returns data in 'data' field, but typically API returns { success: true, data: [...] }
    } catch (error) {
       throw error.response?.data || { message: 'Failed to fetch foods' };
    }
  },

  createFood: async (foodData) => {
    try {
      const response = await axiosInstance.post('/food', foodData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create food' };
    }
  },

  updateFood: async (id, foodData) => {
    try {
       const response = await axiosInstance.put(`/food/${id}`, foodData);
       return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update food' };
    }
  },

  deleteFood: async (id) => {
    try {
      const response = await axiosInstance.delete(`/food/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete food' };
    }
  },
  
  getFoodById: async (id) => {
      try {
          const response = await axiosInstance.get(`/food/${id}`);
          return response.data;
      } catch (error) {
          throw error.response?.data || { message: 'Failed to fetch food details' };
      }
  }
};

export default foodService;
