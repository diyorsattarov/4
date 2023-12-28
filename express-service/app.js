const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Serve the static index.jade file at the root URL ("/")
app.get('/', async (req, res) => {
  try {
    // You can render the 'index' template (index.jade) here
    res.render('index');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// WebSocket connection to 'ws://beast:8080/'
const ws = new WebSocket('ws://beast:8080');

// Handle WebSocket open event
ws.on('open', () => {
  console.log('WebSocket connection opened');
});

app.post('/submit-data', async (req, res) => {
  try {
    // You can access the JSON data from the request body
    const jsonData = req.body;

    // Log the contents of the JSON message
    console.log('Received JSON data:', jsonData);

    // Check if there is a "method" property in the JSON data
    if (jsonData.method === "get_product" && jsonData.product_id) {
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



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
