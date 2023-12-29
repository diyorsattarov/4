import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ProductPage() {
  const { productId } = useParams(); // Get the productId from the URL
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    if (!productId) {
      // Exit early if no productId is provided
      console.log('No Product ID provided');
      return;
    }

    console.log(`Fetching product data for Product ID: ${productId}`);

    fetch(`http://localhost:5000/get_product?product_id=${productId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Received data:', data);
        setResponseText(JSON.stringify(data));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [productId]); // Re-fetch data when productId changes

  // Conditional rendering based on whether productId is available
  if (!productId) {
    return (
      <div>
        <h1>Please Provide a Product ID</h1>
        <p>Enter a product ID in the URL to view details.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Product Details for Product ID: {productId}</h1>
      <textarea
        placeholder="Server Response"
        value={responseText}
        readOnly
        rows={10}
      />
    </div>
  );
}

export default ProductPage;
