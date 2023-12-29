import React, { useState, useEffect } from 'react';

function Catalog() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10; // Fixed number of products per page
  
  useEffect(() => {
    fetch(`http://localhost:5000/get_all_products?page=${currentPage}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then(data => {
        console.log('Received products:', data);
        setProducts(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [currentPage]); // Dependency array includes currentPage
  

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  
  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };
  
  // Inside the return statement of the Catalog component
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
  
      <div>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage}</span>
        <button onClick={handleNextPage}>Next</button> {/* Add logic to disable when on last page */}
      </div>
    </div>
  );
  
}

export default Catalog;
