import React, { useState, useRef, useMemo } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Plus,
  Check,
  Maximize2,
  Calendar,
  Share2,
  ExternalLink,
  Compass,
  Layers,
  BarChart,
  Activity,
  Zap,
} from 'lucide-react';
import { AssetQuote, CandlePoint } from '../types';

interface AssetDetailModalProps {
  asset: AssetQuote | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (asset: AssetQuote) => void;
}

type ChartType = 'area' | 'candles';
type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL';

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  if (!asset) return null;

  const [chartType, setChartType] = useState<ChartType>('area');
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [showSMA, setShowSMA] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const isPos = asset.changePercent >= 0;

  // Derive timeframe data slice
  const candles = useMemo(() => {
    const total = asset.candles || [];
    if (timeframe === '1D') return total.slice(-10);
    if (timeframe === '5D') return total.slice(-15);
    if (timeframe === '1M') return total;
    if (timeframe === '6M') return total;
    return total;
  }, [asset.candles, timeframe]);

  const activeCandle = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];

  // Price bounds
  const minPrice = Math.min(...candles.map((c) => c.low));
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = Math.max(...candles.map((c) => c.volume || 1));

  // Chart layout dimensions
  const chartWidth = 720;
  const chartHeight = 320;
  const paddingBottom = 40;
  const usableHeight = chartHeight - paddingBottom;

  // Calculate coordinates for points
  const points = candles.map((c, i) => {
    const x = (i / (candles.length - 1 || 1)) * (chartWidth - 60) + 30;
    const y = usableHeight - ((c.close - minPrice) / priceRange) * (usableHeight - 30) - 15;
    return { x, y, candle: c };
  });

  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const lineStr = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    return `${lineStr} L ${lastX.toFixed(1)} ${usableHeight} L ${firstX.toFixed(1)} ${usableHeight} Z`;
  }, [points, usableHeight]);

  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  }, [points]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="asset-detail-modal-container"
        className="bg-white w-full max-w-5xl max-h-[92vh] rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            {asset.badgeText ? (
              <div
                style={{ backgroundColor: asset.badgeBg || '#131722', color: asset.badgeTextColor || '#FFF' }}
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs"
              >
                {asset.badgeText}
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                {asset.symbol.slice(0, 3)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900 leading-none">{asset.name}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                  {asset.symbol}
                </span>
                {asset.country && (
                  <span className="text-xs text-gray-400 font-medium hidden sm:inline">• {asset.country}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{asset.sector || 'Financial Asset'}</p>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2">
            <button
              id="modal-toggle-watchlist"
              onClick={() => onToggleWatchlist(asset)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isWatchlisted
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {isWatchlisted ? (
                <>
                  <Check className="w-3.5 h-3.5" /> In Watchlist
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" /> Watchlist
                </>
              )}
            </button>
            <button
              id="modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto custom-scrollbar p-5 space-y-6 flex-grow">
          {/* Price Overview Banner */}
          <div className="flex flex-wrap items-end justify-between gap-4 p-4 rounded-xl bg-gray-50/70 border border-gray-100">
            <div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                Real-Time Spot Price
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                  {asset.price < 10
                    ? asset.price.toFixed(4)
                    : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="text-sm font-semibold text-gray-500">{asset.currency || 'USD'}</span>
                <span
                  className={`text-sm font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                    isPos ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {isPos ? '+' : ''}
                  {asset.change < 1 ? asset.change.toFixed(4) : asset.change.toFixed(2)} (
                  {isPos ? '+' : ''}
                  {asset.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 sm:gap-6 text-right">
              <div>
                <div className="text-xs text-gray-400 font-medium">Day High</div>
                <div className="text-sm font-semibold text-gray-900">{asset.high.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium">Day Low</div>
                <div className="text-sm font-semibold text-gray-900">{asset.low.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium">Volume</div>
                <div className="text-sm font-semibold text-gray-900">{asset.volume}</div>
              </div>
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div className="border border-gray-100 rounded-2xl p-4 bg-white shadow-2xs">
            {/* Chart Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
              {/* Timeframes */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      timeframe === tf
                        ? 'bg-white text-blue-600 shadow-2xs font-bold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Chart Options */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-100 p-1 rounded-lg text-xs font-medium">
                  <button
                    onClick={() => setChartType('area')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      chartType === 'area' ? 'bg-white text-gray-900 shadow-2xs font-semibold' : 'text-gray-500'
                    }`}
                  >
                    Line
                  </button>
                  <button
                    onClick={() => setChartType('candles')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      chartType === 'candles' ? 'bg-white text-gray-900 shadow-2xs font-semibold' : 'text-gray-500'
                    }`}
                  >
                    Candles
                  </button>
                </div>

                <button
                  onClick={() => setShowSMA(!showSMA)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    showSMA ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                >
                  SMA (20)
                </button>
                <button
                  onClick={() => setShowVolume(!showVolume)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    showVolume ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                >
                  Vol
                </button>
              </div>
            </div>

            {/* Hover Scrubber Info Bar */}
            {activeCandle && (
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-2 font-mono">
                <span>Date: <strong className="text-gray-800">{activeCandle.time}</strong></span>
                <span>O: <strong className="text-gray-800">{activeCandle.open.toFixed(2)}</strong></span>
                <span>H: <strong className="text-emerald-700">{activeCandle.high.toFixed(2)}</strong></span>
                <span>L: <strong className="text-rose-700">{activeCandle.low.toFixed(2)}</strong></span>
                <span>C: <strong className="text-gray-900">{activeCandle.close.toFixed(2)}</strong></span>
              </div>
            )}

            {/* SVG Chart Stage */}
            <div className="relative w-full h-[280px] select-none">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full overflow-visible"
                onMouseLeave={() => setHoverIndex(null)}
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPos ? '#10B981' : '#F43F5E'} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={isPos ? '#10B981' : '#F43F5E'} stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
                  const y = usableHeight * ratio;
                  const priceVal = maxPrice - ratio * priceRange;
                  return (
                    <g key={ratio}>
                      <line x1="0" y1={y} x2={chartWidth} y2={y} stroke="#F1F5F9" strokeDasharray="3 3" />
                      <text x={chartWidth - 4} y={y - 4} fill="#94A3B8" fontSize="10" textAnchor="end">
                        {priceVal.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                {/* Volume Bars */}
                {showVolume &&
                  candles.map((c, i) => {
                    const x = (i / (candles.length - 1 || 1)) * (chartWidth - 60) + 30;
                    const vHeight = (c.volume / maxVolume) * 35;
                    const isGreen = c.close >= c.open;
                    return (
                      <rect
                        key={`vol-${i}`}
                        x={x - 3}
                        y={usableHeight - vHeight}
                        width="6"
                        height={vHeight}
                        fill={isGreen ? '#10B981' : '#F43F5E'}
                        opacity="0.35"
                      />
                    );
                  })}

                {/* Chart Type Rendering */}
                {chartType === 'area' ? (
                  <>
                    <path d={areaPath} fill="url(#areaGradient)" />
                    <path
                      d={linePath}
                      fill="none"
                      stroke={isPos ? '#10B981' : '#F43F5E'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                ) : (
                  /* Candlestick Rendering */
                  candles.map((c, i) => {
                    const x = (i / (candles.length - 1 || 1)) * (chartWidth - 60) + 30;
                    const isGreen = c.close >= c.open;
                    const bodyTop = usableHeight - ((Math.max(c.open, c.close) - minPrice) / priceRange) * (usableHeight - 30) - 15;
                    const bodyBottom = usableHeight - ((Math.min(c.open, c.close) - minPrice) / priceRange) * (usableHeight - 30) - 15;
                    const bodyHeight = Math.max(bodyBottom - bodyTop, 2);
                    const wickTop = usableHeight - ((c.high - minPrice) / priceRange) * (usableHeight - 30) - 15;
                    const wickBottom = usableHeight - ((c.low - minPrice) / priceRange) * (usableHeight - 30) - 15;

                    return (
                      <g key={`candle-${i}`}>
                        {/* High/Low Wick */}
                        <line
                          x1={x}
                          y1={wickTop}
                          x2={x}
                          y2={wickBottom}
                          stroke={isGreen ? '#10B981' : '#F43F5E'}
                          strokeWidth="1.5"
                        />
                        {/* Candle Body */}
                        <rect
                          x={x - 4}
                          y={bodyTop}
                          width="8"
                          height={bodyHeight}
                          fill={isGreen ? '#10B981' : '#F43F5E'}
                          rx="1"
                        />
                      </g>
                    );
                  })
                )}

                {/* Interactive Scrubber crosshair */}
                {hoverIndex !== null && points[hoverIndex] && (
                  <g>
                    <line
                      x1={points[hoverIndex].x}
                      y1="0"
                      x2={points[hoverIndex].x}
                      y2={usableHeight}
                      stroke="#64748B"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx={points[hoverIndex].x}
                      cy={points[hoverIndex].y}
                      r="4"
                      fill={isPos ? '#10B981' : '#F43F5E'}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  </g>
                )}

                {/* Invisible hover zones */}
                {points.map((p, i) => (
                  <rect
                    key={`hover-zone-${i}`}
                    x={p.x - 12}
                    y="0"
                    width="24"
                    height={usableHeight}
                    fill="transparent"
                    onMouseEnter={() => setHoverIndex(i)}
                    className="cursor-crosshair"
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Technical Analysis Gauge & Key Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Technical Gauge Box */}
            <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-600" />
                  Technical Summary
                </h4>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    asset.rating.includes('Buy')
                      ? 'bg-emerald-100 text-emerald-800'
                      : asset.rating.includes('Sell')
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {asset.rating}
                </span>
              </div>

              {/* Speedometer Gauge Visual */}
              <div className="my-3 flex flex-col items-center">
                <div className="relative w-44 h-24 overflow-hidden">
                  <svg viewBox="0 0 100 50" className="w-full h-full">
                    {/* Gauge background arc */}
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    {/* Color segments */}
                    <path
                      d="M 10 50 A 40 40 0 0 1 30 21.7"
                      fill="none"
                      stroke="#F43F5E"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 30 21.7 A 40 40 0 0 1 70 21.7"
                      fill="none"
                      stroke="#CBD5E1"
                      strokeWidth="8"
                    />
                    <path
                      d="M 70 21.7 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    {/* Indicator needle */}
                    <line
                      x1="50"
                      y1="50"
                      x2={50 + 32 * Math.cos(((asset.technicalScore + 100) / 200) * Math.PI - Math.PI)}
                      y2={50 + 32 * Math.sin(((asset.technicalScore + 100) / 200) * Math.PI - Math.PI)}
                      stroke="#1E293B"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="50" cy="50" r="4" fill="#1E293B" />
                  </svg>
                </div>
                <div className="flex justify-between w-full text-[11px] text-gray-400 font-semibold px-2">
                  <span>Strong Sell</span>
                  <span>Neutral</span>
                  <span>Strong Buy</span>
                </div>
              </div>

              {/* Oscillators vs Moving Averages summary */}
              <div className="space-y-2 pt-3 border-t border-gray-100 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Oscillators (RSI {asset.oscillators.rsi})</span>
                  <span className="font-semibold text-gray-800">{asset.oscillators.rating}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Moving Averages (SMA 50)</span>
                  <span className="font-semibold text-emerald-600">{asset.movingAverages.rating}</span>
                </div>
              </div>
            </div>

            {/* Key Statistics Grid */}
            <div className="lg:col-span-2 border border-gray-100 rounded-2xl p-5 bg-white shadow-2xs">
              <h4 className="font-bold text-gray-900 mb-4">Key Statistics & Valuation</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-sm">
                <div>
                  <div className="text-xs text-gray-400 font-medium">Market Cap</div>
                  <div className="font-semibold text-gray-900">{asset.marketCap || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">P/E Ratio (TTM)</div>
                  <div className="font-semibold text-gray-900">{asset.peRatio ? asset.peRatio.toFixed(1) : 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">Div Yield</div>
                  <div className="font-semibold text-gray-900">{asset.divYield || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">Beta (1Y)</div>
                  <div className="font-semibold text-gray-900">{asset.beta ? asset.beta.toFixed(2) : '1.00'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">Prev Close</div>
                  <div className="font-semibold text-gray-900">{asset.prevClose.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">Open</div>
                  <div className="font-semibold text-gray-900">{asset.open.toFixed(2)}</div>
                </div>
              </div>

              {/* 52 Week Range Bar */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-500 font-medium mb-1">
                  <span>52W Low: <strong>${asset.week52Low.toFixed(2)}</strong></span>
                  <span>52W High: <strong>${asset.week52High.toFixed(2)}</strong></span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full relative overflow-hidden">
                  <div
                    style={{
                      width: `${Math.min(
                        Math.max(((asset.price - asset.week52Low) / (asset.week52High - asset.week52Low)) * 100, 5),
                        95
                      )}%`,
                    }}
                    className="h-full bg-blue-600 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description & News */}
          <div className="space-y-4">
            <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-2xs">
              <h4 className="font-bold text-gray-900 mb-2">About {asset.name}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{asset.description}</p>
            </div>

            {asset.news && asset.news.length > 0 && (
              <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-2xs">
                <h4 className="font-bold text-gray-900 mb-3">Market Headlines & Insights</h4>
                <div className="space-y-3">
                  {asset.news.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100 transition-colors flex items-start justify-between gap-3"
                    >
                      <div>
                        <h5 className="font-semibold text-gray-900 text-sm leading-snug">{item.title}</h5>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                          <span className="font-medium text-gray-600">{item.source}</span>
                          <span>•</span>
                          <span>{item.timeAgo}</span>
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md shrink-0 capitalize ${
                          item.sentiment === 'positive'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.sentiment === 'negative'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {item.sentiment}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
