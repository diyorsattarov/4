// Assuming this is CatalogPage.js
import React from 'react';
import useSession from '../hooks/session';
import NavBar from '../components/NavBar'; // Adjust the import path as necessary
import LoginForm from '../components/LoginForm';
import Catalog from '../components/Catalog'; // Import the Catalog component

function CatalogPage() {
  const { isLoggedIn, handleLogin } = useSession();

  return (
    <div>
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div>
          <NavBar />
          <Catalog /> {/* Render the imported Catalog component */}
        </div>
      )}
    </div>
  );
}

export default CatalogPage;
