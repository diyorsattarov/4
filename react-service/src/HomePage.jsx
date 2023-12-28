// HomePage.js
import React from 'react';
import { Link } from 'react-router-dom'; // Make sure to import Link from react-router-dom

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <ul>
        <li><Link to="/form-page">Go to Form Page</Link></li>
        <li><Link to="/product">Go to Product Page</Link></li>
      </ul>
    </div>
  );
}

export default HomePage;
