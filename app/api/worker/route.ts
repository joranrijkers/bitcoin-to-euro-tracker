import { NextResponse } from 'next/server';
import { workerService } from '@/services/worker';

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