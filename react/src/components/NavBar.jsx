// components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/catalog">Catalog Page</Link></li>
        {/* Add additional links as needed */}
      </ul>
    </nav>
  );
}

export default Navbar;
