import { NextResponse } from 'next/server';
import { getHistoricalRates } from '@/db';

export async function GET() {
  try {
    const rates = await getHistoricalRates();
    return NextResponse.json({
      success: true,
      data: rates
    });
  } catch (error: any) {
    console.error('Error fetching historical rates:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 