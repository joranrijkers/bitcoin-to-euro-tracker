import { NextResponse } from 'next/server';
import { prisma } from '@/services/prisma';

export async function GET() {
  try {
    const latestRate = await prisma.rate.findFirst({
      orderBy: {
        timestamp: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: latestRate
    });
  } catch (error) {
    console.error('Error fetching rate:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch rate' 
      }, 
      { status: 500 }
    );
  }
}
