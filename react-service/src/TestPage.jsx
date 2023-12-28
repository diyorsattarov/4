import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function TestPage() {
  const { productId } = useParams(); // Get the productId from the URL

  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    console.log(`Fetching product data for Product ID: ${productId}`);

    // Send a GET request to the Express server to retrieve product data based on productId
    fetch(`http://localhost:5000/get_product?product_id=${productId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Received data:', data);

        // Update the state with the response data
        setResponseText(JSON.stringify(data));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [productId]); // Re-fetch data when productId changes

  console.log(`Rendering TestPage for Product ID: ${productId}`);

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

export default TestPage;
