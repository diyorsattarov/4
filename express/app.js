const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const corsOptions = {
  origin: 'http://localhost:5174', // Set to the specific origin
  credentials: true, // Allow credentials (cookies, etc.)
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());

// WebSocket connection to 'ws://beast:8080/'
const ws = new WebSocket('ws://beast:8080');

// Handle WebSocket open event
ws.on('open', () => {
  console.log('WebSocket connection opened');
});

app.post('/submit-data', async (req, res) => {
  try {
    const jsonData = req.body;
    console.log('Received JSON data:', jsonData);

    // Check if the method is 'get_product' and if 'product_id' is provided
    if (jsonData.method === "get_product" && jsonData.product_id) {
      ws.send(JSON.stringify(jsonData));

      ws.once('message', (response) => {
        const responseData = JSON.parse(response);
        res.status(200).json(responseData);
      });
    } else if (jsonData.method === "get_all_products") {
      ws.send(JSON.stringify(jsonData));

      ws.once('message', (response) => {
        const responseData = JSON.parse(response);
        res.status(200).json(responseData);
      });
    } else if (jsonData.method === "login") {
      ws.send(JSON.stringify(jsonData));

      ws.once('message', (response) => {
        const responseData = JSON.parse(response);
        res.status(200).json(responseData);
      });
    } else if (jsonData.method === "validate_cookie") {
      ws.send(JSON.stringify(jsonData));

      ws.once('message', (response) => {
        const responseData = JSON.parse(response);
        res.status(200).json(responseData);
      });
    } else {
      console.error('Invalid JSON request');
      res.status(400).json({ message: 'Invalid JSON request' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/get_product', async (req, res) => {
  try {
    // Get the product ID from the query parameters
    const productID = req.query.product_id;

    // Check if a valid product ID is provided
    if (!productID || isNaN(productID)) {
      console.error('Invalid product ID');
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Create a JSON object with the method and product ID
    const jsonData = {
      method: 'get_product',
      product_id: productID,
    };

    // Log the JSON data
    console.log('Sending JSON data:', jsonData);

    // Send the JSON request as a WebSocket message to 'ws://localhost:8080/'
    ws.send(JSON.stringify(jsonData));

    // Listen for a response from the WebSocket server
    ws.once('message', (response) => {
      // Parse the response from the WebSocket server
      const responseData = JSON.parse(response);
      console.log(`beast-service responseData: ${JSON.stringify(responseData)}`);

      // Send the response from the WebSocket server as the HTTP response
      res.status(200).json(responseData);
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/get_all_products', async (req, res) => {
  try {
    // Extract the page number from query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified

    // Create a JSON object for the 'get_all_products' method
    const jsonData = { 
      method: 'get_all_products',
      page: page,
      limit: 10  // Limit is always 10
    };

    // Send the JSON request as a WebSocket message to 'ws://beast:8080/'
    ws.send(JSON.stringify(jsonData));

    // Listen for a response from the WebSocket server
    ws.once('message', (response) => {
      const responseData = JSON.parse(response);
      res.status(200).json(responseData);
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
