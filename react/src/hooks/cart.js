// hooks/useCart.js
import { useState } from 'react';

const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Check if product is already in the cart
      const isProductInCart = prevItems.find(item => item.product_id === product.product_id);
      if (isProductInCart) {
        // Increase quantity if product is already in cart
        return prevItems.map(item => 
          item.product_id === product.product_id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Add new product to cart
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  return { cartItems, addToCart };
};

export default useCart;
