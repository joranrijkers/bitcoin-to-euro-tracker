import { NextResponse } from 'next/server';
import { getLatestRate } from '@/db';
import { workerService } from '@/services/worker';

export async function GET() {
  try {
    // Ensure worker is running
    if (!workerService.isActive()) {
      // Add a small initial delay to prevent immediate rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      await workerService.start();

    }

    const rate = await getLatestRate();
    if (!rate) {
      return NextResponse.json({
        success: true,
        data: {
          rate: null,
          message: 'Initializing data collection...'
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        rate: rate.rate,
        timestamp: rate.timestamp
      }
    });
  } catch (error: any) {
    console.error('Error fetching rate:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 