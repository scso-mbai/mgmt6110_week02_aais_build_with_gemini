import React from 'react';
import { X, Trash2, ArrowUpRight, Plus, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { AssetQuote } from '../types';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistItems: AssetQuote[];
  onRemoveItem: (id: string) => void;
  onSelectAsset: (asset: AssetQuote) => void;
  onAddPreset: (asset: AssetQuote) => void;
  allAssets: AssetQuote[];
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistItems,
  onRemoveItem,
  onSelectAsset,
  onAddPreset,
  allAssets,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="watchlist-drawer-container"
          className="w-screen max-w-md bg-white border-l border-gray-100 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900 text-lg">My Watchlist</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                {watchlistItems.length}
              </span>
            </div>
            <button
              id="watchlist-close-btn"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-2">
            {watchlistItems.length === 0 ? (
              <div className="py-12 text-center text-gray-400 space-y-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Your watchlist is empty</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Click the + button next to any quote to track your favorite assets.
                  </p>
                </div>

                {/* Quick Add Suggestions */}
                <div className="pt-4 border-t border-gray-100 text-left">
                  <div className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
                    Quick Add Popular Assets
                  </div>
                  <div className="space-y-1.5">
                    {allAssets.slice(0, 4).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onAddPreset(item)}
                        className="w-full flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors text-xs font-medium text-gray-800 hover:text-blue-600 cursor-pointer"
                      >
                        <span className="font-bold">{item.symbol}</span>
                        <span>{item.name}</span>
                        <span className="text-blue-600 font-semibold">+ Add</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              watchlistItems.map((asset) => {
                const isPos = asset.changePercent >= 0;
                return (
                  <div
                    key={asset.id}
                    id={`watchlist-item-${asset.id}`}
                    onClick={() => {
                      onSelectAsset(asset);
                      onClose();
                    }}
                    className="p-3.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-between cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      {asset.badgeText ? (
                        <div
                          style={{
                            backgroundColor: asset.badgeBg || '#131722',
                            color: asset.badgeTextColor || '#FFF',
                          }}
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                        >
                          {asset.badgeText}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                          {asset.symbol.slice(0, 3)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                          {asset.symbol}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[120px]">{asset.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {asset.price < 10
                            ? asset.price.toFixed(4)
                            : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <div className={`text-xs font-semibold ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveItem(asset.id);
                        }}
                        className="p-1.5 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {watchlistItems.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
              <span>Prices updated in real-time</span>
              <button
                onClick={() => {
                  watchlistItems.forEach((item) => onRemoveItem(item.id));
                }}
                className="text-rose-600 hover:underline font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
