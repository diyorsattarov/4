// HomePage.js
import React from 'react';
import useSession from '../hooks/session';
import NavBar from '../components/NavBar';
import LoginForm from '../components/LoginForm';
import './HomePage.css'; // Import only if using a specific stylesheet for HomePage

function HomePage() {
  const { isLoggedIn, username, handleLogin, handleLogout } = useSession();

  return (
    <div>
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div>
          <NavBar />
          <p>Welcome, {username}</p>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
