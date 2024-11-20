import { workerService } from '@/services/worker';

export async function initializeApp() {
  console.log('Starting background worker...');
  await workerService.start();
} 