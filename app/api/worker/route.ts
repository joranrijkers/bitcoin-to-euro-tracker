import { NextResponse } from 'next/server';
import { workerService } from '@/services/worker';
import type { BitcoinRate, HistoricalRate } from '@/types/api';

export async function POST() {
  try {
    await workerService.start();
    return NextResponse.json({
      success: true,
      message: 'Worker started successfully'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    workerService.stop();
    return NextResponse.json({
      success: true,
      message: 'Worker stopped successfully'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function GET(): Promise<Response> {
  try {
    const response = await fetch(
      'https://api.coindesk.com/v1/bpi/currentprice/EUR.json'
    );
    return response;
    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch data' }, { status: response.status });
    }
    const data: BitcoinRate = await response.json();
    // ... rest of the code
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
} 