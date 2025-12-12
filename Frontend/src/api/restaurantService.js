import axiosInstance from './axios';

const restaurantService = {
  // Apply for restaurant partnership
  applyRestaurant: async (data) => {
    try {
      const response = await axiosInstance.post('/restaurant/apply', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Application failed' };
    }
  },

  // Get current user's restaurant application status
  getRestaurantStatus: async () => {
    try {
      const response = await axiosInstance.get('/restaurant/status');
      return response.data;
    } catch (error) {
      // If 404, it might mean no application exists, which is valid state
      if (error.response?.status === 404) {
          return null; // Or rethrow depending on how frontend handles it
      }
      throw error.response?.data || { message: 'Failed to fetch status' };
    }
  },

  // Admin: Get all applications
  getAllApplications: async () => {
    try {
      const response = await axiosInstance.get('/restaurant/applications');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch applications' };
    }
  },

  // Admin: Update application status
  updateRestaurantStatus: async (id, status) => {
    try {
      const response = await axiosInstance.put(`/restaurant/status/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update status' };
    }
  },
};

export default restaurantService;
