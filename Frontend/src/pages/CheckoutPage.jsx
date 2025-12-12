import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useLocation, useNavigate } from 'react-router-dom';
import orderService from '../api/orderService';
import { load } from '@cashfreepayments/cashfree-js';

const CheckoutPage = () => {
    const { cartItems, totalAmount, clearCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine if it's a direct buy or cart checkout
    // directItems format: [{ food: {...}, quantity: 1, price: ... }]
    const directItems = location.state?.items;
    const isDirectBuy = !!directItems;
    
    // Items to process
    const itemsToCheckout = isDirectBuy ? directItems : cartItems;
    const subtotal = isDirectBuy 
        ? directItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
        : totalAmount;

    // Order Type State
    const [orderType, setOrderType] = useState('Delivery');

    // Form inputs
    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
    });

    const [loading, setLoading] = useState(false);
    const [cashfree, setCashfree] = useState(null);

    useEffect(() => {
        const initializeCashfree = async () => {
            const cf = await load({
                mode: "sandbox" // or "production"
            });
            setCashfree(cf);
        };
        initializeCashfree();
    }, []);

    // Redirect if no items
    useEffect(() => {
        if (!itemsToCheckout || itemsToCheckout.length === 0) {
            navigate('/cart');
        }
    }, [itemsToCheckout, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare order data
            const orderData = {
                items: itemsToCheckout.map(item => ({
                    food: item.food._id || item.food, // handle if food is object or id 
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: subtotal + (orderType === 'Delivery' ? 40 : 0),
                orderType,
                shippingAddress: orderType === 'Delivery' ? shippingAddress : undefined
            };

            const response = await orderService.placeOrder(orderData);

            if (response.paymentSessionId && cashfree) {
                const checkoutOptions = {
                    paymentSessionId: response.paymentSessionId,
                    redirectTarget: "_self", // Or _blank
                };
                
                cashfree.checkout(checkoutOptions);
                // Note: Cashfree redirects, so code below might not run if redirect matches current window.
                // If using components or popup, might be different.
            } else {
                 // Fallback or if Backend didn't return session (e.g. COD - not implemented yet)
                 navigate(`/order/success?order_id=${response.orderId}`);
            }

            // If success and not direct buy, clear cart
            if (!isDirectBuy) {
               // We might want to clear ONLY after successful payment verification
               // but for now, assuming redirect flow, we clear it on success page or safely here
               // Standard practice: Clear on success page confirmation. 
               // keeping it here for simplicity of current task flow, but ideally move to verify.
               // clearCart(); -> Moved to Success Page logic or after successful API call if not redirecting
            }

        } catch (error) {
            console.error(error);
            alert(error.message || 'Failed to place order');
            setLoading(false);
        }
    };

    if (!itemsToCheckout || itemsToCheckout.length === 0) return null;

    return (
        <div className="container mx-auto mt-10 px-4 mb-20 animate-fade-in-up">
            <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side: Order Details & Address */}
                <div className="w-full lg:w-2/3 space-y-6">
                    
                    {/* Order Type Selection */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Dining Option</h2>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setOrderType('Delivery')}
                                className={`flex-1 py-3 rounded-md font-medium border-2 transition ${orderType === 'Delivery' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                            >
                                <span className="block text-lg">Delivery</span>
                                <span className="text-sm font-normal">Delivered to your doorstep</span>
                            </button>
                            <button 
                                onClick={() => setOrderType('Dine-in')}
                                className={`flex-1 py-3 rounded-md font-medium border-2 transition ${orderType === 'Dine-in' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                            >
                                <span className="block text-lg">Dine-In</span>
                                <span className="text-sm font-normal">Eat at the restaurant</span>
                            </button>
                        </div>
                    </div>

                    {/* Address Form (Only for Delivery) */}
                    {orderType === 'Delivery' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 mb-1">Street Address</label>
                                    <input 
                                        type="text" 
                                        name="street" 
                                        value={shippingAddress.street}
                                        onChange={handleInputChange}
                                        className="w-full border rounded p-2 focus:ring-2 focus:ring-orange-200 outline-none" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">City</label>
                                    <input 
                                        type="text" 
                                        name="city" 
                                        value={shippingAddress.city}
                                        onChange={handleInputChange}
                                        className="w-full border rounded p-2 focus:ring-2 focus:ring-orange-200 outline-none" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">State</label>
                                    <input 
                                        type="text" 
                                        name="state" 
                                        value={shippingAddress.state}
                                        onChange={handleInputChange}
                                        className="w-full border rounded p-2 focus:ring-2 focus:ring-orange-200 outline-none" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Zip Code</label>
                                    <input 
                                        type="text" 
                                        name="zipCode" 
                                        value={shippingAddress.zipCode}
                                        onChange={handleInputChange}
                                        className="w-full border rounded p-2 focus:ring-2 focus:ring-orange-200 outline-none" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Country</label>
                                    <input 
                                        type="text" 
                                        name="country" 
                                        value={shippingAddress.country}
                                        onChange={handleInputChange}
                                        className="w-full border rounded p-2 focus:ring-2 focus:ring-orange-200 outline-none" 
                                        readOnly
                                    />
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Right Side: Order Summary */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                           {itemsToCheckout.map((item, idx) => (
                               <div key={idx} className="flex justify-between items-center text-sm">
                                   <div className='flex items-center gap-2'>
                                        <span className='font-medium text-gray-800'>{item.quantity}x</span> 
                                        <span className='text-gray-600 truncate max-w-[150px]'>{item.food.name || 'Food Item'}</span>
                                   </div>
                                   <span className='font-medium'>₹{(item.price * item.quantity).toFixed(2)}</span>
                               </div>
                           ))}
                        </div>
                        
                        <div className="border-t pt-4 space-y-2">
                             <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            {orderType === 'Delivery' && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span>₹40.00</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-xl pt-2 border-t mt-2">
                                <span>Total</span>
                                <span>₹{(subtotal + (orderType === 'Delivery' ? 40 : 0)).toFixed(2)}</span>
                            </div>
                        </div>

                        <button 
                            onClick={handlePlaceOrder}
                            disabled={loading || (orderType === 'Delivery' && !shippingAddress.street)}
                            className={`w-full mt-6 py-3 rounded-md font-bold text-white shadow-lg transition transform active:scale-95 ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'}`}
                        >
                            {loading ? 'Processing...' : `Pay ₹${(subtotal + (orderType === 'Delivery' ? 40 : 0)).toFixed(2)}`}
                        </button>
                        <p className='text-xs text-center text-gray-400 mt-2'>Secured by Cashfree Payments</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
