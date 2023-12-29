// HomePage.js
import React from 'react';
import useSession from '../hooks/session';
import NavBar from '../components/NavBar'; // Adjust the import path as necessary
import LoginForm from '../components/LoginForm';

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
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}


export default HomePage;
