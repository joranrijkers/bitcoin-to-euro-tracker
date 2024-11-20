const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { join } = require('path');

async function setupDatabase() {
  try {
    const db = await open({
      filename: join(process.cwd(), 'data', 'btc-eur.db'),
      driver: sqlite3.Database,
    });

    // Create rates table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS rates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        rate DECIMAL(10, 2) NOT NULL
      )
    `);

    console.log('Database setup completed successfully');
    await db.close();
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase(); 