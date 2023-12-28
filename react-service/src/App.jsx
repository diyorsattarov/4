import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import FormPage from './FormPage';
import ProductPage from './ProductPage'; // Assuming you have a ProductPage component
import CatalogPage from './CatalogPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<HomePage/>} />
        <Route path="/form-page" element={<FormPage/>} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/catalog/" element={<CatalogPage />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;
