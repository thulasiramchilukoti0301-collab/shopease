import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

const getCartKey = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user?.id ? `cart_${user.id}` : 'cart_guest';
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem(getCartKey());
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
  }, [cart]);

  // Reset cart when user changes
  useEffect(() => {
    const savedCart = localStorage.getItem(getCartKey());
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, [localStorage.getItem('user')]);

  const addToCart = (product, quantity = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return false; // Signal that user needs to login
    }
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    return true;
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart(prev =>
      prev.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(getCartKey());
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);