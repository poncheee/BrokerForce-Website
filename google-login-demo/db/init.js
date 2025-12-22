// Database initialization script
// Run this to set up the database schema: node db/init.js

const fs = require("fs");
const path = require("path");
const { pool } = require("./index");

async function initDatabase() {
  try {
    console.log("Initializing database...");

    // Read schema file
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    // Execute schema
    await pool.query(schema);

    console.log("✅ Database schema created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
}

initDatabase();
