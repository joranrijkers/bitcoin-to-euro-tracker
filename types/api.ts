export interface BitcoinRate {
  time: {
    updated: string;
    updatedISO: string;
  };
  bpi: {
    EUR: {
      rate_float: number;
      rate: string;
      description: string;
      code: string;
    };
  };
}

export interface HistoricalRate {
  timestamp: string;
  rate: number;
} 