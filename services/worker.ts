import axios from 'axios';
import { saveRate, getLatestRate } from '@/db';

class WorkerService {
  private static instance: WorkerService;
  private isRunning: boolean = false;
  private lastRate: number | null = null;
  private lastSavedRate: number | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private lastRequestTime: number = 0;
  private readonly INTERVAL = 5000; // 5 seconds in milliseconds
  private readonly BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCEUR';

  private constructor() {
    console.log('Worker service initialized with Binance API');
  }

  static getInstance(): WorkerService {
    if (!WorkerService.instance) {
      WorkerService.instance = new WorkerService();
    }
    return WorkerService.instance;
  }

  private async fetchBitcoinRate(): Promise<number | null> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    // Wait if needed to ensure exactly 5 seconds between requests
    if (timeSinceLastRequest < this.INTERVAL) {
      await new Promise(resolve => setTimeout(resolve, this.INTERVAL - timeSinceLastRequest));
    }

    try {
      this.lastRequestTime = Date.now();
      console.log(`Fetching rate at: ${new Date().toLocaleTimeString()}`);

      const response = await axios.get(this.BINANCE_API_URL, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Bitcoin-Euro-Tracker'
        }
      });

      const rate = parseFloat(response.data.price);

      if (isNaN(rate)) {
        throw new Error('Invalid rate received from Binance API');
      }

      return Number(rate.toFixed(2)); // Round to 2 decimal places
    } catch (error: any) {
      if (error.response) {
        console.error('Binance API error:', error.response.data);
      } else {
        console.error('Error fetching Bitcoin rate:', error.message);
      }
      return null;
    }
  }

  private async checkAndSaveRate() {
    try {
      const newRate = await this.fetchBitcoinRate();
      
      if (newRate && newRate !== this.lastSavedRate) {
        console.log(`Rate changed: ${this.lastSavedRate?.toFixed(2)} -> ${newRate.toFixed(2)} EUR`);
        await saveRate(newRate);
        this.lastSavedRate = newRate;
      }
      
      this.lastRate = newRate;
    } catch (error) {
      console.error('Error in worker cycle:', error);
    }
  }

  async start() {
    if (this.isRunning) {
      console.log('Worker is already running');
      return;
    }

    console.log('Starting worker...');
    this.isRunning = true;
    this.lastRequestTime = 0; // Reset the last request time

    // Initialize last rate from database
    try {
      const latestRate = await getLatestRate();
      this.lastSavedRate = latestRate?.rate || null;
      this.lastRate = this.lastSavedRate;
      console.log('Initialized with last rate:', this.lastSavedRate?.toFixed(2));
    } catch (error) {
      console.error('Error getting latest rate:', error);
    }

    // Initial fetch
    await this.checkAndSaveRate();

    // Start the interval
    this.intervalId = setInterval(() => {
      if (Date.now() - this.lastRequestTime >= this.INTERVAL) {
        this.checkAndSaveRate();
      }
    }, this.INTERVAL);
  }

  stop() {
    if (!this.isRunning) {
      return;
    }

    console.log('Stopping worker...');
    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  isActive(): boolean {
    return this.isRunning;
  }

  getLastRate(): number | null {
    return this.lastRate;
  }
}

export const workerService = WorkerService.getInstance(); 