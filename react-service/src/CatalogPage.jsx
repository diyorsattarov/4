import React, { useState, useEffect } from 'react';

const staticImageUrl = 'product.png';

function Catalog() {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10; // Fixed number of products per page
  
  useEffect(() => {
    fetch(`http://localhost:5000/get_all_products?page=${currentPage}`)
      .then(response => response.json())
      .then(data => {
        setProducts(data.products);
        setTotalProducts(data.totalProducts);
      })
      .catch(error => console.error('Error:', error));
  }, [currentPage]);
  
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  

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
          <img src={staticImageUrl} alt="Product" style={{ width: '100%', height: 'auto' }} />
          <h2>{product.name}</h2>
          <p><strong>ID:</strong> {product.product_id}</p>
          <p><strong>Description:</strong> {product.description}</p>
        </div>
      ))}
      {/* Pagination Controls */}
    </div>
  );
  
}

export default Catalog;
