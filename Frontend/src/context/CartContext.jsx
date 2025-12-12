import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.find(item => item.food._id === action.payload.food._id);
      if (existingItem) {
        return state.map(item =>
          item.food._id === action.payload.food._id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      }
      return [...state, action.payload];

    case 'REMOVE_FROM_CART':
      return state.filter(item => item.food._id !== action.payload);

    case 'UPDATE_QUANTITY':
        return state.map(item =>
            item.food._id === action.payload.foodId
              ? { ...item, quantity: action.payload.quantity }
              : item
          );

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [], () => {
    const localData = localStorage.getItem('cart');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (food, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { food, quantity } });
  };

  const removeFromCart = (foodId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: foodId });
  };

  const updateQuantity = (foodId, quantity) => {
      if(quantity < 1) return;
      dispatch({ type: 'UPDATE_QUANTITY', payload: { foodId, quantity } });
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const updateCart = (items) => {
    // Helper to bulk set cart if needed, though usually Add/Remove is enough
    // For now clear and add
    clearCart();
    items.forEach(item => addToCart(item.food, item.quantity));
  }

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.food.price * item.quantity), 0);
  const totalItems = cartItems.reduce((acc,item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        totalAmount,
        totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
