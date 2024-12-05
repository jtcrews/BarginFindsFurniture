const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const productRoutes = require('./routes/product.routes'); 
const userRoutes = require('./routes/users.routes'); 
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000; 


app.use(express.static('public'));


app.use(express.static('view'));

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
