import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto mt-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <button 
          onClick={() => navigate('/')} 
          className="bg-orange-500 text-white px-6 py-2 rounded shadow hover:bg-orange-600 transition"
        >
          Browse Food
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 px-4 mb-20">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Cart</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cart Items List */}
        <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-md">
          {cartItems.map((item) => (
            <div key={item.food._id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center gap-4">
                <img 
                  src={item.food.image || 'https://placehold.co/100'} 
                  alt={item.food.name} 
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold text-lg">{item.food.name}</h3>
                  <p className="text-gray-600">₹{item.food.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 <div className="flex items-center border rounded">
                    <button 
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                        onClick={() => updateQuantity(item.food._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                    >
                        -
                    </button>
                    <span className="px-3 font-medium">{item.quantity}</span>
                    <button 
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                        onClick={() => updateQuantity(item.food._id, item.quantity + 1)}
                    >
                        +
                    </button>
                 </div>
                 <button 
                    onClick={() => removeFromCart(item.food._id)}
                    className="text-red-500 hover:text-red-700"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                 </button>
              </div>
            </div>
          ))}
          
          <button 
            onClick={clearCart} 
            className="text-red-500 mt-4 text-sm hover:underline"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md h-fit">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₹40.00</span>
                </div>
                <div className="border-t pt-2 mt-2 font-bold flex justify-between text-lg">
                    <span>Total</span>
                    <span>₹{(totalAmount + 40).toFixed(2)}</span>
                </div>
            </div>

            <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-orange-600 text-white py-3 rounded-md font-semibold hover:bg-orange-700 transition"
            >
                Proceed to Checkout
            </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
