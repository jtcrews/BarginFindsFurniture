// models/product.models.js
const db = require('./db'); // Assume db is set up to connect to your SQLite database

function getColumnNames() {
    return ['id', 'name', 'description', 'price', 'category_id']; // Add all valid column names here
}

function getAll() {
    const sql = "SELECT * FROM products;";
    return db.query(sql); // db.query returns all rows
}

// Get all products by one attribute
function getAllByOneAttribute(attribute, value) {
    const validColumns = getColumnNames();
    if (validColumns.includes(attribute)) {
        const sql = "SELECT * FROM products WHERE " + attribute + " = ?;";
        return db.query(sql, [value]); 
    } else {
        throw new Error(`Invalid column name: ${attribute}`);
    }
}

// Create a new product
function createProduct(params) {
    const sql = `
        INSERT INTO products 
        (name, description, price, category_id) 
        VALUES (?, ?, ?, ?);
    `;
    return db.run(sql, params); // Insert a new product
}

// Update a product by ID
function updateProduct(id, updatedData) {
    const validColumns = getColumnNames();
    if (!validColumns.includes('id')) {
        throw new Error(`Invalid column name: id`);
    }

    const sql = `
        UPDATE products 
        SET name = ?, description = ?, price = ?, category_id = ? 
        WHERE id = ?;
    `;
    return db.run(sql, [
        updatedData.name,
        updatedData.description,
        updatedData.price,
        updatedData.category_id,
        id
    ]);
}

// Delete a product by ID
function deleteProduct(id) {
    const sql = `DELETE FROM products WHERE id = ?;`;
    return db.run(sql, [id]); // Deletes a product
}

// Get a single product by ID
function getProductById(id) {
    const sql = `SELECT * FROM products WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.get(sql, [id], (err, row) => {
            if (err) {
                return reject(err); // Reject on error
            }
            resolve(row); // Resolve with the fetched row
        });
    });
}
// Export the functions
module.exports = {
  getAll,
  getAllByOneAttribute,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById
};
