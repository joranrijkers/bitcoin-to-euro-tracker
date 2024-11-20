import CurrentRate from '@/components/CurrentRate';
import HistoricalChart from '@/components/HistoricalChart';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-100">
          Bitcoin to Euro Rate Tracker
        </h1>
        <CurrentRate />
        <HistoricalChart />
      </div>
    </main>
  );
}
