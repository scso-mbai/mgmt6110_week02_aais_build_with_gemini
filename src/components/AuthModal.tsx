import React, { useState } from 'react';
import { X, Check, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="auth-modal-container"
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 p-6 relative overflow-hidden animate-in zoom-in-95 duration-150"
      >
        <button
          id="auth-modal-close"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Welcome to TradingView Markets!</h3>
            <p className="text-sm text-gray-500">Your custom dashboard and watchlist have been activated.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  TV
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Look first / Then leap</h3>
              <p className="text-sm text-gray-500">Join millions of traders tracking global market movements.</p>
            </div>

            {/* Social Logins */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(true);
                  setTimeout(onClose, 1200);
                }}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-xs text-gray-400 uppercase font-medium">Or email</span>
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-[11px] text-center text-gray-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>By continuing, you agree to Market Terms of Service & Privacy Policy</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
