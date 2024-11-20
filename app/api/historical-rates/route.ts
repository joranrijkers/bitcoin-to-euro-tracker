import { NextResponse } from 'next/server';
import { prisma } from '@/services/prisma';

export async function GET() {
  try {
    const rates = await prisma.rate.findMany({
      orderBy: {
        timestamp: 'asc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      rates 
    });
  } catch (error) {
    console.error('Error fetching historical rates:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch rates' 
      }, 
      { status: 500 }
    );
  }
} 