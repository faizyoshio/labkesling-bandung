import React from 'react';
import { ShoppingBag, History, Search, Users } from 'lucide-react';
import type { LabSettings } from '../types';

interface NavbarProps {
  settings: LabSettings;
  cartCount: number;
  onOpenCart: () => void;
  onOpenHistory: () => void;
  onOpenAssistants: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  cartCount,
  onOpenCart,
  onOpenHistory,
  onOpenAssistants,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Lab Title Poltekkes Bandung */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              src={settings.logo_url || '/logo-poltekkes-bandung.png'}
              alt="Logo Poltekkes Kemenkes Bandung"
              className="h-9 sm:h-11 w-auto max-w-[190px] sm:max-w-[240px] object-contain"
            />
            <div className="hidden md:block border-l border-slate-200 pl-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-slate-800 leading-tight">
                  {settings.department_name}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Lab Terpadu
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {settings.lab_name}
              </p>
            </div>
          </div>

          {/* Search Bar Desktop */}
          <div className="hidden lg:flex flex-1 max-w-sm relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari alat (Erlenmeyer, DO Meter, Sound Level)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-100 hover:bg-slate-200/70 focus:bg-white border border-transparent focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl transition-all outline-hidden"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Tombol Struktur Asisten Lab */}
            <button
              onClick={onOpenAssistants}
              title="Struktur Pengelola & Asisten Laboratorium"
              className="px-2.5 py-2 text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">Asisten Lab</span>
            </button>

            {/* Riwayat Peminjaman */}
            <button
              onClick={onOpenHistory}
              title="Riwayat Peminjaman Alat"
              className="p-2 sm:px-2.5 sm:py-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors border border-slate-200/70"
            >
              <History className="w-4 h-4 text-slate-600" />
              <span className="hidden xl:inline">Log Pinjam</span>
            </button>

            {/* Cart / Selected Items Badge */}
            <button
              onClick={onOpenCart}
              className="btn-shine relative p-2.5 sm:px-3.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all duration-200"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Keranjang</span>
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="animate-badge-pop inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] font-bold leading-none text-emerald-700 bg-white rounded-full shadow-xs"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Search Bar Mobile / Tablet */}
        <div className="lg:hidden pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari alat (Erlenmeyer, DO Meter, Sound Level)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100 focus:bg-white border border-transparent focus:border-emerald-500 rounded-xl outline-hidden"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"
              >
                ✕
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
