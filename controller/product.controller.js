// controllers/product.controller.js
const productModel = require('../models/product.models');

const productController = {
    // Get all products
    getAll: async (req, res) => {
        try {
            const products = await productModel.getAll();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get a product by ID
    getById: async (req, res) => {
        const { id } = req.params;  // Retrieve product ID from URL params
        try {
            const product = await productModel.getProductById(id);  // Await the DB call
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(product);  // Return the product as JSON
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ error: error.message });
        }
    },
    

    // Create a new product
    create: async (req, res) => {
        const { name, description, price, category_id } = req.body;
        try {
            const result = await productModel.createProduct([name, description, price, category_id]);
            res.status(201).json({ message: 'Product created successfully', productId: result.lastID });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update an existing product
    update: async (req, res) => {
        const { id } = req.params;
        const { name, description, price, category_id } = req.body;
        try {
            const result = await productModel.updateProduct(id, { name, description, price, category_id });
            if (result.changes === 0) {
                return res.status(404).json({ message: 'Product not found or no changes made' });
            }
            res.json({ message: 'Product updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete a product
    delete: async (req, res) => {
        const { id } = req.params;
        try {
            const result = await productModel.deleteProduct(id);
            if (result.changes === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = productController;