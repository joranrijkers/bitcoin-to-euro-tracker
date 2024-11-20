import { NextResponse } from 'next/server';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { join } from 'path';

export async function GET() {
  try {
    const db = await open({
      filename: join(process.cwd(), 'btc-eur.db'),
      driver: sqlite3.Database
    });

    // Get all rates up to now, ordered by timestamp
    const rates = await db.all(`
      SELECT 
        datetime(timestamp, 'localtime') as timestamp,
        rate 
      FROM rates 
      ORDER BY timestamp ASC
    `);

    await db.close();

    return NextResponse.json({ 
      success: true, 
      rates,
      count: rates.length,
      currentTime: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching historical rates:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch historical rates' 
      }, 
      { status: 500 }
    );
  }
} 