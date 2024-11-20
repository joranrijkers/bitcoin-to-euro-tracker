'use client';

import { useDataFetching } from '@/hooks/useDataFetching';
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
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RateData {
  timestamp: string;
  rate: number;
}

export default function HistoricalChart() {
  const { data: historicalData, loading, error } = 
    useDataFetching<RateData[]>('/api/historical-rates', 5000);

  const processedData = historicalData?.reduce<{ labels: string[]; rates: number[] }>(
    (acc, current, index, array) => {
      const prevRate = index > 0 ? array[index - 1].rate : null;
      const rateChanged = current.rate !== prevRate;

      acc.labels.push(rateChanged ? 'changed' : '');
      acc.rates.push(current.rate);
      
      return acc;
    },
    { labels: [], rates: [] }
  ) || { labels: [], rates: [] };

  const chartData = {
    labels: processedData.labels,
    datasets: [
      {
        label: 'BTC/EUR Rate',
        data: processedData.rates,
        borderColor: 'rgb(96, 165, 250)',
        backgroundColor: 'rgba(96, 165, 250, 0.5)',
        tension: 0.1,
        pointRadius: (ctx: any) => {
          return processedData.labels[ctx.dataIndex] === 'changed' ? 2 : 0;
        },
        pointHoverRadius: 5
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e5e7eb'
        }
      },
      title: {
        display: true,
        text: 'BTC/EUR Rate History',
        color: '#e5e7eb'
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: any[]) => {
            const index = tooltipItems[0].dataIndex;
            return new Date(historicalData![index].timestamp).toLocaleTimeString();
          },
          label: (context: any) => {
            return `€${context.parsed.y.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: '#374151'
        },
        ticks: {
          color: '#e5e7eb',
          callback: (value: number) => {
            return `€${value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`;
          }
        }
      }
    }
  };

  if (loading && !historicalData) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Historical Rate Chart</h2>
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-gray-600 animate-pulse">Loading chart data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">Historical Rate Chart</h2>
      {error && (
        <div className="text-red-400 p-4 bg-red-900/50 rounded mb-4">
          {error}
        </div>
      )}
      <div className="h-[400px]">
        <Line 
          data={chartData} 
          options={{
            ...options,
            scales: {
              x: {
                display: false,
                grid: {
                  display: false
                }
              },
              y: {
                type: 'linear',
                beginAtZero: false,
                grid: {
                  color: '#374151'
                },
                ticks: {
                  color: '#e5e7eb',
                  callback: function(tickValue: number | string) {
                    const value = Number(tickValue);
                    return `€${value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}`;
                  }
                }
              }
            }
          }} 
        />
      </div>
    </div>
  );
}