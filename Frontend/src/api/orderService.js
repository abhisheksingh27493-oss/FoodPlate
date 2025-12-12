import axiosInstance from './axios';

const orderService = {
  // Place a new order
  placeOrder: async (orderData) => {
    try {
      const response = await axiosInstance.post('/order', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to place order' };
    }
  },

  // Get logged in user's orders
  getMyOrders: async () => {
    try {
      const response = await axiosInstance.get('/order/myorders');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  },

  // Get single order
  getOrderById: async (id) => {
    try {
        const response = await axiosInstance.get(`/order/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch order' };
    }
  },

  // Quick Order
  quickOrder: async (orderData) => {
    try {
        const response = await axiosInstance.post('/order/quick', orderData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to place quick order' };
    }
  },

  // Update order status (Admin/Restaurant)
  updateOrderStatus: async (id, status) => {
    try {
      const response = await axiosInstance.put(`/order/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update order status' };
    }
  },

  // Cancel order
  cancelOrder: async (id) => {
      try {
          const response = await axiosInstance.put(`/order/${id}/cancel`);
          return response.data;
      } catch (error) {
          throw error.response?.data || { message: 'Failed to cancel order' };
      }
  },

  // Verify payment
  verifyPayment: async (orderId) => {
    try {
      const response = await axiosInstance.post('/payment/verify', { orderId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Payment verification failed' };
    }
  }
};

export default orderService;
