import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import orderService from '../api/orderService';
import { useCart } from '../context/CartContext';

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  const orderId = searchParams.get('order_id');
  const [status, setStatus] = useState('Verifying...');
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (!orderId) {
        setStatus('Invalid Order');
        return;
    }

    const verify = async () => {
        try {
            const data = await orderService.verifyPayment(orderId);
            if (data.status === 'Paid') {
                setStatus('Payment Successful!');
                setOrderDetails(data.data);
                // Clear cart on successful payment
                clearCart(); 
            } else {
                setStatus('Payment Failed or Pending');
            }
        } catch (error) {
            console.error(error);
            setStatus('Verification Failed');
        }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full">
        {status === 'Payment Successful!' ? (
            <div className="text-green-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        ) : (
             <div className="text-yellow-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        )}

        <h2 className="text-2xl font-bold mb-2 text-gray-800">{status}</h2>
        <p className="text-gray-600 mb-6">Order ID: {orderId}</p>

        <div className="flex gap-4 justify-center">
            <button 
                onClick={() => navigate('/order')} 
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded hover:bg-gray-200 transition"
            >
                View Orders
            </button>
            <button 
                onClick={() => navigate('/')} 
                className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition"
            >
                Continue Shopping
            </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
