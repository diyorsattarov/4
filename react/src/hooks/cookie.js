// auth.js
export async function useCookie(username, cookie) {
  try {
    const response = await fetch('http://localhost:5000/submit-data', {  // Make sure the URL is correct
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        method: 'validate_cookie',
        username: username,
        cookie: cookie
      })
    });

    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Network response was not ok.');
    }
  } catch (error) {
    console.error('Error validating cookie:', error);
    return { status: 'error', message: 'Error validating cookie' };
  }
}
