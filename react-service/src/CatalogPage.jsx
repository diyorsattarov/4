import React, { useState, useEffect } from 'react';

function Catalog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/get_all_products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Received products:', data);
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []); // Empty dependency array to fetch only once when the component mounts

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Product Catalog</h1>
      {products.map((product, index) => (
        <div key={index} style={{ border: '1px solid black', margin: '10px', padding: '20px', width: '300px' }}>
          <h2>{product.name}</h2>
          <p><strong>ID:</strong> {product.product_id}</p>
          <p><strong>Description:</strong> {product.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Catalog;
