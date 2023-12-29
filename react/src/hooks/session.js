// useSession.js
import { useState, useEffect } from 'react';
import { useCookie } from './cookie';

const useSession = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const storedUsername = localStorage.getItem('username');
      const storedCookie = localStorage.getItem('cookie');
      if (storedUsername && storedCookie) {
        const validationResponse = await useCookie(storedUsername, storedCookie);
        if (validationResponse.status === 'success') {
          setUsername(storedUsername);
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('cookie');
          localStorage.removeItem('username');
          setIsLoggedIn(false);
        }
      }
    };

    checkSession();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('cookie');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
  };

  const handleLogin = async (username, password) => {
    const loginData = {
      method: "login",
      username: username,
      password: password
    };

    const response = await fetch('http://localhost:5000/submit-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(loginData)
    });

    const data = await response.json();
    if (data.status === 'success') {
      localStorage.setItem('cookie', data.cookie);
      localStorage.setItem('username', username);
      setIsLoggedIn(true);
    }
  };

  return { isLoggedIn, username, handleLogin, handleLogout };
};

export default useSession;
