import { NextResponse } from 'next/server';
import { prisma } from '@/services/prisma';

export async function GET() {
  try {
    const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/EUR.json');
    const data = await response.json();
    const rate = data.bpi.EUR.rate_float;

    const newRate = await prisma.rate.create({
      data: {
        rate: rate
      }
    });

    return NextResponse.json({
      success: true,
      data: newRate
    });
  } catch (error) {
    console.error('Error updating rate:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update rate' 
      }, 
      { status: 500 }
    );
  }
}
