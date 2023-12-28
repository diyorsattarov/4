// FormPage.js
import React, { useState } from 'react';

function FormPage() {
    const [inputJson, setInputJson] = useState(''); // State for input JSON
    const [responseText, setResponseText] = useState('');
  
    const handleSubmit = async () => {
      try {
        console.log('Submitting JSON:', inputJson); // Log the input JSON
  
        // Send a POST request to the Express server with the JSON data from inputJson
        const response = await fetch('http://localhost:5000/submit-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: inputJson, // Use the JSON data from inputJson directly
        });
  
        if (response.ok) {
          console.log('Request successful'); // Log successful request
  
          const responseData = await response.json();
          console.log('Received response data:', responseData); // Log the response data
  
          // Update the state with the response data you want to display
          setResponseText(JSON.stringify(responseData)); // Convert JSON to a string for display
        } else {
          console.error('Failed to send data'); // Log failed request
        }
      } catch (error) {
        console.error('Error:', error); // Log any errors
      }
    };  
  return (
    <div>
      <h1>Form Page</h1>
      <textarea
        rows="10"
        cols="50"
        placeholder="Enter JSON data"
        value={inputJson}
        onChange={(e) => setInputJson(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
      <textarea
        rows="10"
        cols="50"
        placeholder="Server Response"
        value={responseText}
        readOnly
      />
    </div>
  );
}

export default FormPage;
