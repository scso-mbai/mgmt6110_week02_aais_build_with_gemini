import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, ArrowRight, CornerDownLeft } from 'lucide-react';
import { AssetQuote, AssetCategory } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: AssetQuote[];
  onSelectAsset: (asset: AssetQuote) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  assets,
  onSelectAsset,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Escape to close, Arrows to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredAssets.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filteredAssets[selectedIndex]) {
        e.preventDefault();
        onSelectAsset(filteredAssets[selectedIndex]);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'us_stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'futures', label: 'Futures' },
    { id: 'bonds_gov', label: 'Bonds' },
    { id: 'etfs', label: 'ETFs' },
  ];

  const filteredAssets = assets.filter((asset) => {
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const q = query.toLowerCase().trim();
    const matchesQuery =
      q === '' ||
      asset.symbol.toLowerCase().includes(q) ||
      asset.name.toLowerCase().includes(q) ||
      asset.sector?.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="search-modal-container"
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            id="search-modal-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search symbols, companies, crypto, forex, futures..."
            className="w-full text-base font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[11px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200">
            ESC
          </kbd>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/70 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCategory(c.id);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-200/70'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar divide-y divide-gray-50 p-2">
          {filteredAssets.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No market results found for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try searching by ticker (e.g. AAPL, BTC, SPX)</p>
            </div>
          ) : (
            filteredAssets.map((asset, i) => {
              const isSelected = i === selectedIndex;
              const isPos = asset.changePercent >= 0;

              return (
                <div
                  key={asset.id}
                  id={`search-result-item-${asset.id}`}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`p-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                    isSelected ? 'bg-blue-50/80 text-blue-900' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {asset.badgeText ? (
                      <div
                        style={{ backgroundColor: asset.badgeBg || '#131722', color: asset.badgeTextColor || '#FFF' }}
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                      >
                        {asset.badgeText}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {asset.symbol.slice(0, 3)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{asset.symbol}</span>
                        <span className="text-xs text-gray-400 uppercase">{asset.category.replace('_', ' ')}</span>
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{asset.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {asset.price < 10 ? asset.price.toFixed(4) : asset.price.toLocaleString()}
                      </div>
                      <div className={`text-xs font-semibold ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    {isSelected && (
                      <CornerDownLeft className="w-4 h-4 text-blue-600 shrink-0 hidden sm:inline" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span>Use <strong>↑</strong> <strong>↓</strong> to navigate</span>
            <span><strong>↵</strong> to select</span>
          </div>
          <span>Showing {filteredAssets.length} symbols</span>
        </div>
      </div>
    </div>
  );
};
