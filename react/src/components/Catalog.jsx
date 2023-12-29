// components/Catalog.jsx
import React from 'react';
import useSession from '../hooks/session';
import useCatalog from '../hooks/catalog';
import LoginForm from '../components/LoginForm';
import './Catalog.css'; // Import the CSS file

function Catalog() {
  const { isLoggedIn, handleLogin } = useSession();
  const { products, currentPage, totalPages, handleNextPage, handlePreviousPage } = useCatalog();

  return (
    <div>
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div className="catalog-container">
          <h1>Product Catalog</h1>
          {products.map((product) => (
            <div key={product.product_id} className="product-card">
              <img src={`product_${product.product_id}.png`} alt={`Product ${product.product_id}`} />
              <h2>{product.name}</h2>
              <p><strong>ID:</strong> {product.product_id}</p>
              <p><strong>Description:</strong> {product.description}</p>
            </div>
          ))}
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Catalog;
