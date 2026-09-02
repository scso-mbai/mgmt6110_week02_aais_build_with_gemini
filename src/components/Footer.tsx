import React from 'react';
import { Globe, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-gray-100 bg-white py-12 mt-16 text-xs text-gray-500 select-none">
      <div className="max-w-[1240px] mx-auto px-4 lg:px-8 space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-sm">Products</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-600 transition-colors">SuperCharts</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Pine Script™</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Stock Screener</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Crypto Screener</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Economic Calendar</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-sm">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-600 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Wall of Love</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Athletes & Ambassadors</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-sm">Community</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Refer a friend</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Ideas stream</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Scripts & Indicators</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Streams</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">House Rules</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-sm">For Business</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Widgets</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Advertising</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Brokerage Integration</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Partner Program</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg fill="none" height="20" viewBox="0 0 32 24" width="28" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0H8.384L12.576 24H4.192L0 0Z" fill="#131722" />
              <path d="M16 0H32L27.808 24H11.808L16 0Z" fill="#131722" />
            </svg>
            <span>TradingView clone • Markets Everywhere</span>
          </div>

          <p className="text-center sm:text-right text-xs text-gray-400">
            Real-time market quotes and financial analytics simulator.
          </p>
        </div>
      </div>
    </footer>
  );
};
