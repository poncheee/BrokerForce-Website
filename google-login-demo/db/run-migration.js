// Migration runner script
// Run this with: node db/run-migration.js
// Make sure DATABASE_URL is set in your environment

const { query } = require("../db/index");
const fs = require("fs");
const path = require("path");

async function runMigration() {
  try {
    console.log("🔄 Starting migration: Add first_name and last_name columns...");
    
    // Read the migration SQL file
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, "migrate_add_first_last_name.sql"),
      "utf8"
    );

    // Execute the migration
    console.log("📝 Executing migration SQL...");
    await query(migrationSQL);

    console.log("✅ Migration completed successfully!");
    
    // Verify the columns were added
    console.log("🔍 Verifying migration...");
    const checkResult = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('first_name', 'last_name')
      ORDER BY column_name;
    `);

    if (checkResult.rows.length === 2) {
      console.log("✅ Verification successful! Columns found:");
      checkResult.rows.forEach((row) => {
        console.log(`   - ${row.column_name}: ${row.data_type}`);
      });
    } else {
      console.warn("⚠️  Warning: Expected 2 columns but found:", checkResult.rows.length);
      console.log("Columns found:", checkResult.rows);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();

