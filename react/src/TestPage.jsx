import React, { useState, useEffect } from 'react';
import { validateCookie } from './auth';
function TestPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const storedUsername = localStorage.getItem('username');
      const storedCookie = localStorage.getItem('cookie');
      if (storedUsername && storedCookie) {
        const validationResponse = await validateCookie(storedUsername, storedCookie);
        if (validationResponse.status === 'success') {
          setUsername(storedUsername);
          setIsLoggedIn(true);
        } else {
          // Handle the case where the cookie is invalid
          setIsLoggedIn(false);
          localStorage.removeItem('cookie');
          localStorage.removeItem('username');
        }
      }
    };

    checkSession();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const loginData = {
      method: "login",
      username: username,
      password: password
    };

    fetch('http://localhost:5000/submit-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      if (data.status === 'success') {
        localStorage.setItem('cookie', data.cookie);
        localStorage.setItem('username', username);
        setIsLoggedIn(true); // Update login state
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleLogout = () => {
    // Clear stored data and update state
    localStorage.removeItem('cookie');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <div>
      <h1>Test Page</h1>
      {!isLoggedIn ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <div>
          <p>Welcome, {username}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default TestPage;
