import type { HistoricalRate } from '@/types/api';
import { getHistoricalRates } from '@/db';

export async function GET(): Promise<Response> {
  try {
    const rates: HistoricalRate[] = await getHistoricalRates();
    return Response.json({ rates });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
} 