// components/Cart.js
import React from 'react';

function Cart({ cartItems }) {
  return (
    <div className="cart">
      {cartItems.map(item => (
        <div key={item.product_id}>
          <p>{item.name}</p>
          <p>Quantity: {item.quantity}</p>
          {/* Add more product details as needed */}
        </div>
      ))}
    </div>
  );
}

export default Cart;
