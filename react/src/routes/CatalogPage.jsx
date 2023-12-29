// Catalog.jsx
import React from 'react';
import useSession from '../hooks/session';
import useCatalog from '../hooks/catalog'; // Make sure this is correctly imported
import NavBar from '../components/NavBar';
import LoginForm from '../components/LoginForm';

function Catalog() {
  const { isLoggedIn, handleLogin } = useSession();
  const { products, currentPage, totalPages, handleNextPage, handlePreviousPage } = useCatalog();

  return (
    <div>
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <NavBar />
          <h1>Product Catalog</h1>
          {products.map((product) => (
            <div key={product.product_id} style={{ border: '1px solid black', margin: '10px', padding: '20px', width: '300px' }}>
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
      )}
    </div>
  );
}

export default Catalog;
