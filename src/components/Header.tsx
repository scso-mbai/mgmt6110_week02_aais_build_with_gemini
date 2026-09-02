import React, { useState } from 'react';
import { Globe, User, Search, Menu, X, ChevronDown, Check, TrendingUp, Sparkles, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  watchlistCount: number;
  onToggleWatchlist: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenAuth,
  activeNav,
  setActiveNav,
  watchlistCount,
  onToggleWatchlist,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const languages = [
    { code: 'EN', name: 'English (US)' },
    { code: 'ES', name: 'Español' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'FR', name: 'Français' },
    { code: 'JA', name: '日本語' },
    { code: 'ZH', name: '简体中文' },
  ];

  return (
    <header className="w-full border-b border-gray-100 bg-white sticky top-0 z-40 transition-colors">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-6 h-[72px] flex items-center justify-between relative">
        {/* Logo and Search Container */}
        <div className="flex items-center gap-4 lg:gap-8 w-full max-w-[480px]">
          {/* TV Logo */}
          <button
            id="header-tv-logo"
            aria-label="TradingView Logo"
            onClick={() => setActiveNav('Markets')}
            className="shrink-0 flex items-center justify-center cursor-pointer group transition-transform active:scale-95"
          >
            <svg
              fill="none"
              height="28"
              viewBox="0 0 32 24"
              width="40"
              xmlns="http://www.w3.org/2000/svg"
              className="group-hover:opacity-85 transition-opacity"
            >
              <path d="M0 0H8.384L12.576 24H4.192L0 0Z" fill="#131722" />
              <path d="M16 0H32L27.808 24H11.808L16 0Z" fill="#131722" />
              <path d="M23.808 24H27.808L32 0H28L23.808 24Z" fill="white" />
              <path d="M4.192 24H8.384L12.576 0H8.384L4.192 24Z" fill="white" />
            </svg>
          </button>

          {/* Search Bar Trigger */}
          <div
            id="header-search-trigger"
            onClick={onOpenSearch}
            className="flex items-center bg-gray-100 hover:bg-gray-200/80 transition-all rounded-full px-4 h-11 w-full text-gray-500 cursor-pointer select-none group border border-transparent hover:border-gray-200"
          >
            <Search className="w-4 h-4 shrink-0 text-gray-400 group-hover:text-gray-700 transition-colors" />
            <span className="ml-3 text-[15px] font-medium leading-none text-gray-500 group-hover:text-gray-800">
              Search (Ctrl+K)
            </span>
            <div className="ml-auto hidden sm:flex items-center gap-1 text-[11px] bg-white text-gray-400 font-semibold px-2 py-0.5 rounded-md border border-gray-200 shadow-2xs">
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Main Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 absolute left-1/2 -translate-x-1/2 h-full">
          {['Products', 'Community', 'Markets', 'Brokers', 'More'].map((item) => {
            const isActive = activeNav === item;
            return (
              <button
                key={item}
                id={`nav-link-${item.toLowerCase()}`}
                onClick={() => setActiveNav(item)}
                className={`text-[15px] font-medium h-full flex items-center transition-colors relative cursor-pointer px-1 ${
                  isActive
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-800 hover:text-blue-600'
                }`}
              >
                {item}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-blue-600 rounded-t-sm" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions (Watchlist, Language, Profile, CTA) */}
        <div className="flex items-center gap-3 lg:gap-5 shrink-0">
          {/* Watchlist Toggle Button */}
          <button
            id="header-watchlist-btn"
            onClick={onToggleWatchlist}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors text-[14px] font-medium"
            title="Toggle Watchlist"
          >
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Watchlist</span>
            {watchlistCount > 0 && (
              <span className="bg-blue-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              id="header-lang-btn"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="hidden md:flex items-center gap-1.5 text-gray-700 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
            >
              <Globe className="w-5 h-5 text-gray-600" />
              <span className="text-[14px] font-medium uppercase">{selectedLang}</span>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Select Language
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang.code);
                      setIsLangOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm flex items-center justify-between text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    <span>{lang.name}</span>
                    {selectedLang === lang.code && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Button */}
          <div className="relative">
            <button
              id="header-profile-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              <User className="w-5 h-5" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Signed in as guest</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">trader@markets.live</p>
                </div>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onToggleWatchlist();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  My Watchlists ({watchlistCount})
                </button>
                <div className="my-1 border-t border-gray-100" />
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50"
                >
                  Create free account
                </button>
              </div>
            )}
          </div>

          {/* Get Started CTA */}
          <button
            id="header-get-started-cta"
            onClick={onOpenAuth}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-[15px] font-semibold h-10 px-5 sm:px-6 rounded-full flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-98"
          >
            Get started
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="header-mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2 shadow-lg">
          {['Products', 'Community', 'Markets', 'Brokers', 'More'].map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveNav(item);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-base font-medium ${
                activeNav === item ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-800 hover:bg-gray-50'
              }`}
            >
              {item}
            </button>
          ))}
          <div className="pt-2 border-t border-gray-100 flex gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-center"
            >
              Get started for free
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
