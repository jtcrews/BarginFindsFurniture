const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Optional, for Cross-Origin Resource Sharing
const productRoutes = require('./routes/product.routes'); // Your routes for products
const userRoutes = require('./routes/users.routes'); // Your routes for users
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000; // Default to port 3000

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Serve static HTML files from the 'view' folder
app.use(express.static('view'));

// Optional: Replace the root route '/' to serve 'index.html'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable CORS if frontend is hosted separately

// Routes
app.use('/api/products', productRoutes); // Products-related API endpoints
app.use('/api/users', userRoutes); // Users-related API endpoints


// Error Handling
app.use((req, res, next) => {
    res.status(404).send({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Internal Server Error' });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
