import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { join } from 'path';

export async function getDatabase() {
  const dbPath = process.env.NODE_ENV === 'production' 
    ? join(process.cwd(), 'data', 'btc-eur.db')
    : join(process.cwd(), 'btc-eur.db');

  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
} 