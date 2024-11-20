'use client';

import { useDataFetching } from '@/hooks/useDataFetching';

interface RateData {
  rate: number;
  timestamp: string;
}

export default function CurrentRate() {
  const { data, loading, error } = useDataFetching<RateData>('/api/fetch-rate', 5000);

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">Current BTC/EUR Rate</h2>
      
      {loading && !data && (
        <div className="text-gray-300 animate-pulse">Loading...</div>
      )}
      
      {error && (
        <div className="text-red-400 p-4 bg-red-900/50 rounded">
          {error}
        </div>
      )}
      
      {data && (
        <div>
          <div className="text-4xl font-bold text-blue-400">
            €{data.rate.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </div>
          <div className="text-sm text-gray-400 mt-2">
            Last updated: {new Date(data.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
} 