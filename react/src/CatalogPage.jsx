import React, { useState, useEffect } from 'react';


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
      <div key={product.product_id} style={{ border: '1px solid black', margin: '10px', padding: '20px', width: '300px' }}>
        {/* Use the product_id to generate the image URL */}
        <img src={`product_${product.product_id}.png`} alt={`Product ${product.product_id}`} style={{ width: '100%', height: 'auto' }} />
        <h2>{product.name}</h2>
        <p><strong>ID:</strong> {product.product_id}</p>
        <p><strong>Description:</strong> {product.description}</p>
    </div>
      ))}
  
      <div>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
  
}

export default Catalog;
