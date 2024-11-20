import { NextResponse } from 'next/server';
import { workerService } from '@/services/worker';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { join } from 'path';

export async function POST() {
  try {
    await workerService.start();
    return NextResponse.json({
      success: true,
      message: 'Worker started successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    workerService.stop();
    return NextResponse.json({
      success: true,
      message: 'Worker stopped successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<Response> {
  try {
    const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/EUR.json');
    const data: { bpi: { EUR: { rate_float: number } } } = await response.json();
    const rate = data.bpi.EUR.rate_float;

    const db = await open({
      filename: join(process.cwd(), 'btc-eur.db'),
      driver: sqlite3.Database,
    });

    await db.run(
      `
      INSERT INTO rates (timestamp, rate) 
      VALUES (datetime('now', 'localtime'), ?)
      `,
      [rate]
    );

    await db.close();

    return NextResponse.json({
      success: true,
      message: 'Rate updated successfully',
      timestamp: new Date().toISOString(),
      rate,
    });
  } catch (error: unknown) {
    console.error('Error updating rate:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update rate',
      },
      { status: 500 }
    );
  }
}
