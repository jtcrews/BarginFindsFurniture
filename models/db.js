const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/bff.db');

// Path to the create_tables.sql file
const createTablesScript = path.join(__dirname, 'database', 'create_tables.sql');

// Function to check if a table exists
function checkTableExists(tableName, callback) {
  const query = `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`;
  db.get(query, (err, row) => {
    callback(err, row);
  });
}

// Run the create table script only if tables don't exist
function setupDatabase() {
  checkTableExists('Users', (err, row) => {
    if (err) {
      console.error('Error checking Users table existence:', err);
    } else if (!row) {
      // If table doesn't exist, create the tables
      const sqlScript = fs.readFileSync(createTablesScript, 'utf-8');
      db.exec(sqlScript, (err) => {
        if (err) {
          console.error('Error executing create tables script:', err);
        } else {
          console.log('Tables created successfully');
        }
      });
    } else {
      console.log('Users table already exists, no need to create tables.');
    }
  });
}

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = { db, setupDatabase, query };  // Add query to export
