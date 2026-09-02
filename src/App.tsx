/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { IndicesSection } from './components/IndicesSection';
import { MarketHeatmapAndMovers } from './components/MarketHeatmapAndMovers';
import { AssetDetailModal } from './components/AssetDetailModal';
import { SearchModal } from './components/SearchModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { AssetCategory, MarketRegion, AssetQuote } from './types';
import { ALL_MARKET_ASSETS, INDICES_DATA } from './data/mockMarketData';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<AssetCategory>('us_stocks');
  const [selectedRegion, setSelectedRegion] = useState<MarketRegion>('us');
  const [selectedAsset, setSelectedAsset] = useState<AssetQuote | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<string>('Markets');

  // Watchlist state persisted to localStorage
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist_ids');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch {
      // Fallback
    }
    return new Set(['spx', 'aapl', 'nvda', 'btc']);
  });

  // Real-time market tick simulation
  const [marketAssets, setMarketAssets] = useState<AssetQuote[]>(ALL_MARKET_ASSETS);

  useEffect(() => {
    try {
      localStorage.setItem('tv_watchlist_ids', JSON.stringify(Array.from(watchlistIds)));
    } catch {
      // Handle storage quota
    }
  }, [watchlistIds]);

  // Global Ctrl+K / Cmd+K listener for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time price fluctuations simulation (every 4 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketAssets((prevAssets) =>
        prevAssets.map((asset) => {
          // Small random drift 0.05%
          if (Math.random() > 0.4) {
            const pctDelta = (Math.random() - 0.49) * 0.003;
            const newPrice = Math.max(asset.price * (1 + pctDelta), 0.01);
            const priceDiff = newPrice - asset.prevClose;
            const newChangePercent = (priceDiff / asset.prevClose) * 100;
            return {
              ...asset,
              price: Number(newPrice.toFixed(asset.price < 10 ? 4 : 2)),
              change: Number(priceDiff.toFixed(asset.price < 10 ? 4 : 2)),
              changePercent: Number(newChangePercent.toFixed(2)),
            };
          }
          return asset;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Derived filtered quotes
  const currentCategoryAssets = useMemo(() => {
    return marketAssets.filter((a) => a.category === activeCategory);
  }, [marketAssets, activeCategory]);

  const currentIndices = useMemo(() => {
    return marketAssets.filter((a) => a.category === 'us_stocks' && a.badgeText);
  }, [marketAssets]);

  const watchlistAssetItems = useMemo(() => {
    return marketAssets.filter((a) => watchlistIds.has(a.id));
  }, [marketAssets, watchlistIds]);

  const toggleWatchlist = (asset: AssetQuote) => {
    setWatchlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(asset.id)) {
        next.delete(asset.id);
      } else {
        next.add(asset.id);
      }
      return next;
    });
  };

  const removeFromWatchlist = (id: string) => {
    setWatchlistIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans antialiased text-[#131722] selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        watchlistCount={watchlistIds.size}
        onToggleWatchlist={() => setIsWatchlistOpen(!isWatchlistOpen)}
      />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col w-full max-w-[1240px] mx-auto px-4 lg:px-8 py-10 lg:py-16">
        {/* Hero Section with "Markets, everywhere ▾" and Category Pills */}
        <HeroSection
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
          totalAssetsCount={marketAssets.length}
        />

        {/* Indices Section (S&P 500, Nasdaq 100, Dow 30 and category highlights) */}
        <IndicesSection
          indices={currentIndices.length > 0 ? currentIndices : INDICES_DATA}
          selectedAsset={selectedAsset}
          onSelectAsset={setSelectedAsset}
          onViewAllIndices={() => {
            setActiveCategory('us_stocks');
          }}
          activeCategory={activeCategory}
          categoryAssets={currentCategoryAssets}
        />

        {/* Market Movers, Sector Heatmap, & Live Quotes Table */}
        <MarketHeatmapAndMovers
          assets={currentCategoryAssets.length > 0 ? currentCategoryAssets : marketAssets.slice(0, 8)}
          activeCategory={activeCategory}
          onSelectAsset={setSelectedAsset}
          watchlistIds={watchlistIds}
          onToggleWatchlist={toggleWatchlist}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Asset Detail & TradingView Chart Modal */}
      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          isWatchlisted={watchlistIds.has(selectedAsset.id)}
          onToggleWatchlist={toggleWatchlist}
        />
      )}

      {/* Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        assets={marketAssets}
        onSelectAsset={(asset) => {
          setSelectedAsset(asset);
          setIsSearchOpen(false);
        }}
      />

      {/* Watchlist Slide-over Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistItems={watchlistAssetItems}
        onRemoveItem={removeFromWatchlist}
        onSelectAsset={setSelectedAsset}
        onAddPreset={(item) => toggleWatchlist(item)}
        allAssets={marketAssets}
      />

      {/* Auth / Get Started Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
