import React, { useEffect, useState } from 'react';
import orderService from '../api/orderService';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getMyOrders();
            // Assuming API returns { success: true, count: N, data: [...] }
            setOrders(data.data || []);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch orders');
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'text-green-600 bg-green-100';
            case 'Cancelled': return 'text-red-600 bg-red-100';
            case 'Processing': return 'text-blue-600 bg-blue-100';
            default: return 'text-yellow-600 bg-yellow-100';
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>;

    if (error) return <div className="text-center text-red-500 mt-10">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8 mb-20">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
                <Package className="text-orange-500" /> My Orders
            </h1>

            {orders.length === 0 ? (
                <div className="text-center bg-white p-10 rounded-lg shadow">
                    <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
                    <Link to="/" className="inline-block mt-4 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition">
                        Start Ordering
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Order ID: <span className="font-mono text-gray-700">#{order._id.slice(-6)}</span></p>
                                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                    <div className="mt-2 md:mt-0 flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <span className="font-bold text-lg">₹{order.totalAmount}</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Items</h4>
                                    <div className="space-y-2">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                     <span className="font-medium text-gray-800">{item.quantity}x</span>
                                                     <span className="text-gray-600">{item.food?.name || 'Unknown Item'}</span>
                                                </div>
                                                <span className="text-gray-500">₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {order.status === 'Pending' && (
                                     <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                                         {/* Placeholder for Pay Now if unpaid, or Cancel */}
                                         <button className="text-red-500 text-sm hover:underline">Cancel Order</button>
                                     </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;
