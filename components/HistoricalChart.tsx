'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface HistoricalRate {
  timestamp: string;
  rate: number;
}

export default function HistoricalChart() {
  const [chartData, setChartData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistoricalRates() {
      try {
        const response = await fetch('/api/historical-rates');
        if (!response.ok) {
          throw new Error('Failed to fetch historical rates');
        }
        const data = await response.json();
        
        if (!data.rates || !Array.isArray(data.rates)) {
          throw new Error('Invalid data format received');
        }

        const rates: HistoricalRate[] = data.rates;
        
        // Format timestamps to be more readable
        const formatTime = (timestamp: string) => {
          const date = new Date(timestamp);
          return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
        };

        const chartData = {
          labels: rates.map(rate => formatTime(rate.timestamp)),
          datasets: [
            {
              label: 'Bitcoin to Euro Rate',
              data: rates.map(rate => rate.rate),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              tension: 0.3,
              pointRadius: 1, // Smaller points for dense data
              pointHoverRadius: 5,
            },
          ],
        };

        setChartData(chartData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching historical rates:', err);
      }
    }

    // Initial fetch
    fetchHistoricalRates();
    
    // Update every 5 seconds
    const interval = setInterval(fetchHistoricalRates, 5000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error: {error}
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="text-center p-4">
        Loading chart data...
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] p-4">
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 0 // Disable animations for real-time updates
          },
          plugins: {
            legend: {
              position: 'top' as const,
            },
            title: {
              display: true,
              text: 'Bitcoin to Euro Exchange Rate (Real-time)',
              font: {
                size: 16
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => `€${context.parsed.y.toLocaleString()}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              ticks: {
                callback: (value) => `€${value.toLocaleString()}`
              }
            },
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: 45,
                autoSkip: true,
                maxTicksLimit: 20 // Limit the number of x-axis labels
              }
            }
          }
        }}
      />
    </div>
  );
}