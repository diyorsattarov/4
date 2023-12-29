// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './routes/HomePage';
import CatalogPage from './routes/CatalogPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<HomePage/>} />
        <Route path="/catalog/" element={<CatalogPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
