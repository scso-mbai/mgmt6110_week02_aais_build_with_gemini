import React from 'react';
import { ChevronRight, TrendingUp, TrendingDown, Eye, ArrowUpRight } from 'lucide-react';
import { AssetQuote, AssetCategory } from '../types';

interface IndicesSectionProps {
  indices: AssetQuote[];
  selectedAsset: AssetQuote | null;
  onSelectAsset: (asset: AssetQuote) => void;
  onViewAllIndices: () => void;
  activeCategory: AssetCategory;
  categoryAssets: AssetQuote[];
}

export const IndicesSection: React.FC<IndicesSectionProps> = ({
  indices,
  selectedAsset,
  onSelectAsset,
  onViewAllIndices,
  activeCategory,
  categoryAssets,
}) => {
  // S&P 500, Nasdaq 100, Dow 30 are the core 3 indices from the original screenshot
  const sp500 = indices.find((i) => i.id === 'spx') || indices[0];
  const nasdaq = indices.find((i) => i.id === 'ndx') || indices[1];
  const dow = indices.find((i) => i.id === 'dji') || indices[2];

  const mainThree = [
    {
      item: sp500,
      badgeText: '500',
      badgeBg: '#E53935',
      name: 'S&P 500',
      isActiveDefault: true,
    },
    {
      item: nasdaq,
      badgeText: '100',
      badgeBg: '#00897B',
      name: 'Nasdaq 100',
      isActiveDefault: false,
    },
    {
      item: dow,
      badgeText: '30',
      badgeBg: '#039BE5',
      name: 'Dow 30',
      isActiveDefault: false,
    },
  ];

  // If a category other than us_stocks is active, let's also show category benchmark assets below or beside
  const isCustomCategory = activeCategory !== 'us_stocks';

  return (
    <section className="flex flex-col w-full mb-12 select-none">
      {/* Section Header with arrow */}
      <div
        id="indices-section-header"
        onClick={onViewAllIndices}
        className="flex items-center gap-2 mb-6 group cursor-pointer w-max"
      >
        <h2 className="text-[32px] lg:text-[40px] font-bold tracking-tight leading-none text-[#131722] group-hover:text-blue-600 transition-colors">
          Indices
        </h2>
        <svg
          className="mt-1 text-[#131722] group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-150"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Primary 3 Indices Cards Grid (Matching the Screenshot pixel-perfect) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {mainThree.map(({ item, badgeText, badgeBg, name, isActiveDefault }, idx) => {
          const isCurrentlySelected = selectedAsset?.id === item?.id;
          const isCardActive = isCurrentlySelected || (isActiveDefault && !selectedAsset);
          const isPositive = (item?.changePercent || 0) >= 0;

          return (
            <div
              key={item?.id || idx}
              id={`index-card-${item?.id || idx}`}
              onClick={() => item && onSelectAsset(item)}
              className={`group flex items-center justify-between rounded-2xl p-4 lg:p-5 transition-all duration-200 cursor-pointer border ${
                isCardActive
                  ? 'bg-gray-100 border-gray-200 shadow-xs'
                  : 'bg-transparent border-transparent hover:bg-gray-50/90 hover:border-gray-100'
              }`}
            >
              <div className="flex items-center">
                {/* Round Badge Number */}
                <div
                  style={{ backgroundColor: badgeBg }}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 mr-4 shadow-sm group-hover:scale-105 transition-transform"
                >
                  {badgeText}
                </div>

                {/* Title and details */}
                <div className="flex flex-col">
                  <span className="text-[17px] font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {name}
                  </span>
                  {item && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-semibold text-gray-800">
                        {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span
                        className={`text-xs font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                          isPositive
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-rose-700 bg-rose-50'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sparkline & Quick Action */}
              <div className="hidden sm:flex flex-col items-end pl-2">
                <svg className="w-20 h-7 overflow-visible">
                  <path
                    d={generateSparklinePath(item?.sparkline || [10, 15, 12, 18, 20, 25], 80, 28)}
                    fill="none"
                    stroke={isPositive ? '#10B981' : '#F43F5E'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[11px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 text-blue-600 font-medium">
                  View chart <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Category Spotlight for the Active Category */}
      {isCustomCategory && categoryAssets.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 capitalize">
              {activeCategory.replace('_', ' ')} Key Assets
            </h3>
            <span className="text-xs text-gray-500 font-medium">
              {categoryAssets.length} tracked items
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {categoryAssets.slice(0, 3).map((asset) => {
              const isPos = asset.changePercent >= 0;
              return (
                <div
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    {asset.badgeText ? (
                      <div
                        style={{ backgroundColor: asset.badgeBg || '#131722', color: asset.badgeTextColor || '#FFF' }}
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs"
                      >
                        {asset.badgeText}
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                        {asset.symbol.slice(0, 3)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                        {asset.name}
                      </div>
                      <div className="text-xs text-gray-500">{asset.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {asset.price < 10 ? asset.price.toFixed(4) : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`text-xs font-semibold ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

// SVG Sparkline path generator
function generateSparklinePath(data: number[], width: number, height: number): string {
  if (!data || data.length === 0) return '';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  return data
    .map((val, i) => {
      const x = i * stepX;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}
