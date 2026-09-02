import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Activity, Layers, Plus, Check, ArrowUpRight, BarChart2, Sparkles } from 'lucide-react';
import { AssetQuote, AssetCategory } from '../types';
import { SECTOR_HEATMAP_DATA } from '../data/mockMarketData';

interface MarketHeatmapAndMoversProps {
  assets: AssetQuote[];
  activeCategory: AssetCategory;
  onSelectAsset: (asset: AssetQuote) => void;
  watchlistIds: Set<string>;
  onToggleWatchlist: (asset: AssetQuote) => void;
}

export const MarketHeatmapAndMovers: React.FC<MarketHeatmapAndMoversProps> = ({
  assets,
  activeCategory,
  onSelectAsset,
  watchlistIds,
  onToggleWatchlist,
}) => {
  const [activeTab, setActiveTab] = useState<'movers' | 'sectors' | 'all'>('movers');
  const [moversSubTab, setMoversSubTab] = useState<'gainers' | 'losers' | 'volume'>('gainers');

  // Compute gainers, losers, and most active
  const gainers = [...assets].sort((a, b) => b.changePercent - a.changePercent);
  const losers = [...assets].sort((a, b) => a.changePercent - b.changePercent);
  const mostActive = [...assets].sort((a, b) => {
    const volA = parseFloat(a.volume.replace(/[^0-9.]/g, '')) * (a.volume.includes('B') ? 1000 : 1);
    const volB = parseFloat(b.volume.replace(/[^0-9.]/g, '')) * (b.volume.includes('B') ? 1000 : 1);
    return volB - volA;
  });

  const displayList =
    activeTab === 'all'
      ? assets
      : moversSubTab === 'gainers'
      ? gainers
      : moversSubTab === 'losers'
      ? losers
      : mostActive;

  return (
    <section className="w-full flex flex-col pt-4 select-none">
      {/* Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-max">
          <button
            id="tab-market-movers"
            onClick={() => setActiveTab('movers')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'movers'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Market Movers
          </button>
          <button
            id="tab-sector-heatmap"
            onClick={() => setActiveTab('sectors')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'sectors'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-600" />
            Sector Performance
          </button>
          <button
            id="tab-all-quotes"
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <BarChart2 className="w-4 h-4 text-emerald-600" />
            All Quotes ({assets.length})
          </button>
        </div>

        {/* Sub-filters for movers */}
        {activeTab === 'movers' && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMoversSubTab('gainers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                moversSubTab === 'gainers'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Top Gainers
            </button>
            <button
              onClick={() => setMoversSubTab('losers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                moversSubTab === 'losers'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Top Losers
            </button>
            <button
              onClick={() => setMoversSubTab('volume')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                moversSubTab === 'volume'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Most Active
            </button>
          </div>
        )}
      </div>

      {/* Sector Heatmap Tab View */}
      {activeTab === 'sectors' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">S&P 500 Sector Heatmap</h3>
              <p className="text-xs text-gray-500">Real-time market cap weighted returns across industry sectors</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Positive</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500"></span> Negative</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {SECTOR_HEATMAP_DATA.map((item) => {
              const isPos = item.change >= 0;
              return (
                <div
                  key={item.sector}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                    isPos
                      ? 'bg-emerald-50/60 border-emerald-100 hover:border-emerald-300'
                      : 'bg-rose-50/60 border-rose-100 hover:border-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {item.weight}
                    </span>
                    <span
                      className={`text-sm font-bold px-2 py-0.5 rounded-md ${
                        isPos ? 'text-emerald-700 bg-emerald-100/70' : 'text-rose-700 bg-rose-100/70'
                      }`}
                    >
                      {isPos ? '+' : ''}{item.change.toFixed(2)}%
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-base">{item.sector}</h4>
                  <p className="text-xs text-gray-500 mt-1 truncate">Top: {item.topSymbol}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Market Movers & All Quotes Table */
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 lg:px-6">Asset / Symbol</th>
                <th className="py-3.5 px-4 text-right">Price</th>
                <th className="py-3.5 px-4 text-right">Change</th>
                <th className="py-3.5 px-4 text-right">% Change</th>
                <th className="py-3.5 px-4 text-right hidden md:table-cell">24h Range</th>
                <th className="py-3.5 px-4 text-right hidden sm:table-cell">Volume</th>
                <th className="py-3.5 px-4 text-center hidden lg:table-cell">Technical Rating</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {displayList.map((asset) => {
                const isPos = asset.changePercent >= 0;
                const isWatchlisted = watchlistIds.has(asset.id);

                return (
                  <tr
                    key={asset.id}
                    id={`asset-row-${asset.id}`}
                    onClick={() => onSelectAsset(asset)}
                    className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Symbol / Name */}
                    <td className="py-4 px-4 lg:px-6">
                      <div className="flex items-center gap-3">
                        {asset.badgeText ? (
                          <div
                            style={{
                              backgroundColor: asset.badgeBg || '#131722',
                              color: asset.badgeTextColor || '#FFF',
                            }}
                            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs"
                          >
                            {asset.badgeText}
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                            {asset.symbol.slice(0, 3)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {asset.symbol}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[140px] sm:max-w-[200px]">
                            {asset.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 text-right font-semibold text-gray-900">
                      {asset.price < 10
                        ? asset.price.toFixed(4)
                        : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Change */}
                    <td
                      className={`py-4 px-4 text-right font-medium ${
                        isPos ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {asset.change < 1 ? asset.change.toFixed(4) : asset.change.toFixed(2)}
                    </td>

                    {/* % Change */}
                    <td className="py-4 px-4 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md font-semibold text-xs ${
                          isPos
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {asset.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    {/* 24h Range */}
                    <td className="py-4 px-4 text-right text-xs text-gray-500 hidden md:table-cell">
                      <span>{asset.low.toFixed(2)}</span>
                      <span className="text-gray-300 mx-1">—</span>
                      <span>{asset.high.toFixed(2)}</span>
                    </td>

                    {/* Volume */}
                    <td className="py-4 px-4 text-right text-xs font-medium text-gray-600 hidden sm:table-cell">
                      {asset.volume}
                    </td>

                    {/* Technical Rating */}
                    <td className="py-4 px-4 text-center hidden lg:table-cell">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          asset.rating.includes('Buy')
                            ? 'bg-emerald-100 text-emerald-800'
                            : asset.rating.includes('Sell')
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {asset.rating}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          id={`toggle-watchlist-${asset.id}`}
                          onClick={() => onToggleWatchlist(asset)}
                          className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                            isWatchlisted
                              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                              : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                          title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        >
                          {isWatchlisted ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => onSelectAsset(asset)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Open Chart"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
