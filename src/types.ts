export type AssetCategory = 
  | 'us_stocks'
  | 'world_stocks'
  | 'crypto'
  | 'futures'
  | 'forex'
  | 'bonds_gov'
  | 'bonds_corp'
  | 'etfs'
  | 'economy';

export type MarketRegion = 'us' | 'global' | 'europe' | 'asia' | 'emerging';

export interface CandlePoint {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface NewsItem {
  id: string;
  source: string;
  title: string;
  timeAgo: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  url?: string;
}

export interface AssetQuote {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  price: number;
  change: number;
  changePercent: number;
  currency?: string;
  badgeText?: string;
  badgeBg?: string;
  badgeTextColor?: string;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  volume: string;
  marketCap?: string;
  peRatio?: number;
  divYield?: string;
  beta?: number;
  week52High: number;
  week52Low: number;
  rating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  technicalScore: number; // -100 to 100
  oscillators: {
    rsi: number;
    macd: number;
    stoch: number;
    rating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  };
  movingAverages: {
    sma20: number;
    sma50: number;
    sma200: number;
    rating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  };
  sparkline: number[];
  candles: CandlePoint[];
  description: string;
  sector?: string;
  country?: string;
  news: NewsItem[];
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  addedAt: number;
}
