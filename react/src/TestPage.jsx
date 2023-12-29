import React, { useState } from 'react';

function TestPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior

    // Construct the payload
    const loginData = {
      method: "login",
      username: username,
      password: password
    };

    // Send data to your Express service
    fetch('http://localhost:5000/submit-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Include cookies with the request
      body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // Handle success - maybe redirect or show a success message
    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle errors here
    });
  };

  return (
    <div>
      <h1>Test Page</h1>
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
    </div>
  );
}

export default TestPage;
