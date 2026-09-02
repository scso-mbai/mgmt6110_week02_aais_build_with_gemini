import React, { useState } from 'react';
import { ChevronDown, Check, Globe, MapPin, Activity, Flame } from 'lucide-react';
import { AssetCategory, MarketRegion } from '../types';
import { CATEGORIES_CONFIG } from '../data/mockMarketData';

interface HeroSectionProps {
  activeCategory: AssetCategory;
  onSelectCategory: (cat: AssetCategory) => void;
  selectedRegion: MarketRegion;
  onSelectRegion: (reg: MarketRegion) => void;
  totalAssetsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion,
  totalAssetsCount,
}) => {
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);

  const regionOptions: { id: MarketRegion; label: string; sub: string }[] = [
    { id: 'us', label: 'United States & Wall Street', sub: 'NYSE, NASDAQ, CME, CBOE' },
    { id: 'global', label: 'Global Cross-Asset', sub: 'Worldwide macro overview' },
    { id: 'europe', label: 'European Markets', sub: 'LSE, Euronext, Deutsche Börse' },
    { id: 'asia', label: 'Asia-Pacific Markets', sub: 'TSE, HKEX, Shanghai, ASX' },
    { id: 'emerging', label: 'Emerging Economies', sub: 'B3, BSE, JSE, LatAm' },
  ];

  const currentRegionLabel = regionOptions.find((r) => r.id === selectedRegion)?.label || 'Everywhere';

  return (
    <section className="flex flex-col items-center mb-12 lg:mb-16 pt-2 select-none">
      {/* Title with dropdown indicator */}
      <div className="relative mb-8 flex flex-col items-center">
        <button
          id="hero-region-dropdown-trigger"
          onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
          className="flex items-center gap-2 lg:gap-3 group cursor-pointer focus:outline-none transition-transform active:scale-[0.99]"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold tracking-tight text-center leading-none text-[#131722] group-hover:text-blue-600 transition-colors">
            Markets, everywhere
          </h1>
          <ChevronDown
            className={`w-7 h-7 sm:w-8 sm:h-8 text-[#131722] group-hover:text-blue-600 transition-all duration-200 mt-1 sm:mt-2 ${
              isRegionDropdownOpen ? 'rotate-180 text-blue-600' : ''
            }`}
            strokeWidth={3}
          />
        </button>

        {/* Region selector popover */}
        {isRegionDropdownOpen && (
          <div className="absolute top-full mt-3 w-80 sm:w-96 bg-white border border-gray-100 shadow-2xl rounded-2xl p-2 z-30 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Select Market Focus Region</span>
            </div>
            <div className="space-y-1">
              {regionOptions.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => {
                    onSelectRegion(reg.id);
                    setIsRegionDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                    selectedRegion === reg.id
                      ? 'bg-blue-50/80 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="text-sm font-medium">{reg.label}</div>
                    <div className="text-xs text-gray-400">{reg.sub}</div>
                  </div>
                  {selectedRegion === reg.id && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live session status badge */}
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-gray-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>US Markets Open</span>
          <span className="text-gray-300">•</span>
          <span>Real-time feeds connected</span>
        </div>
      </div>

      {/* Asset Class Navigation Filter Bar */}
      <div className="w-full overflow-x-auto scrollbar-hide pb-2">
        <nav className="flex items-center justify-start md:justify-center min-w-max gap-1.5 sm:gap-2 lg:gap-3 mx-auto px-2">
          {CATEGORIES_CONFIG.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`category-tab-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-[15px] font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 font-semibold shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
};
