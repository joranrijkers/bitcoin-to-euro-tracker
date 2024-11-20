import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';

let db: any = null;

export async function getDb() {
  if (db) return db;
  
  try {
    const dbPath = path.join(process.cwd(), 'data');
    await fs.promises.mkdir(dbPath, { recursive: true });

    db = await open({
      filename: path.join(dbPath, 'btc-eur.db'),
      driver: sqlite3.Database
    });

    await db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = NORMAL;
      
      CREATE TABLE IF NOT EXISTS rates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        rate REAL NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_timestamp ON rates(timestamp);
    `);

    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export async function saveRate(rate: number) {
  if (!rate || isNaN(rate)) {
    throw new Error('Invalid rate value');
  }

  const db = await getDb();
  return db.run('INSERT INTO rates (rate, timestamp) VALUES (?, datetime("now"))', rate);
}

export async function getLatestRate() {
  const db = await getDb();
  return db.get(`
    SELECT rate, timestamp 
    FROM rates 
    ORDER BY timestamp DESC 
    LIMIT 1
  `);
}

export async function getHistoricalRates(hours: number = 24) {
  const db = await getDb();
  return db.all(`
    SELECT timestamp, rate
    FROM rates 
    WHERE timestamp >= datetime('now', '-${hours} hours')
    ORDER BY timestamp ASC
  `);
}

// Cleanup old data to maintain performance
export async function cleanupOldData() {
  const db = await getDb();
  await db.run(`
    DELETE FROM rates 
    WHERE timestamp < datetime('now', '-30 days')
  `);
  await db.run('VACUUM');
}
  