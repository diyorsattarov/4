// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import useSession from './hooks/session'; // Adjust the import path as necessary
import NavBar from './components/NavBar';
import LoginForm from './components/LoginForm';
import HomePage from './routes/HomePage';
import CatalogPage from './routes/CatalogPage';

function App() {
  const { isLoggedIn, username, handleLogin, handleLogout } = useSession();

  return (
    <Router>
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div>
          <NavBar />
          <p>Welcome, {username}</p>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
          <Routes>
            <Route path="/" exact element={<HomePage />} />
            <Route path="/catalog/" element={<CatalogPage />} />
          </Routes>
        </div>
      )}
    </Router>
  );
}

export default App;
