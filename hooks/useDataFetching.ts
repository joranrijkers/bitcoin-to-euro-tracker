import { useState, useEffect } from 'react';
import axios from 'axios';

export function useDataFetching<T>(url: string, interval: number = 1000) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError(response.data.error || 'Failed to fetch data');
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchData();

    // Then fetch every interval
    const intervalId = setInterval(fetchData, interval);

    return () => clearInterval(intervalId);
  }, [url, interval]);

  return { data, loading, error };
} 