import React from 'react';
import type { Equipment } from '../types';
import { Info, Plus, Send, MapPin, CheckCircle2, AlertTriangle, XCircle, Sliders } from 'lucide-react';

interface EquipmentCardProps {
  item: Equipment;
  onViewDetail: (item: Equipment) => void;
  onDirectBorrow: (item: Equipment) => void;
  onAddToCart: (item: Equipment) => void;
  isInCart: boolean;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  item,
  onViewDetail,
  onDirectBorrow,
  onAddToCart,
  isInCart,
}) => {
  const getStatusBadge = () => {
    switch (item.status) {
      case 'Tersedia':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-700 text-white shadow-xs">
            <CheckCircle2 className="w-3 h-3" />
            Tersedia ({item.available_stock})
          </span>
        );
      case 'Terbatas':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-600 text-white shadow-xs">
            <AlertTriangle className="w-3 h-3" />
            Sisa {item.available_stock}
          </span>
        );
      case 'Maintenance':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-600 text-white shadow-xs">
            <XCircle className="w-3 h-3" />
            Maintenance
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col group">
      
      {/* Image Container with clickable trigger for detail */}
      <div 
        onClick={() => onViewDetail(item)}
        className="relative h-48 w-full bg-slate-100 overflow-hidden cursor-pointer"
      >
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />

        {/* Status Badge Top Left */}
        <div className="absolute top-3 left-3">
          {getStatusBadge()}
        </div>

        {/* Capacity / Spec Pill Top Right */}
        {item.capacity_spec && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900/90 text-white shadow-xs">
            {item.capacity_spec}
          </div>
        )}

        {/* Category Pill Bottom Left */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-white/95 text-slate-800 border border-slate-200 shadow-xs">
            {item.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            onClick={() => onViewDetail(item)}
            className="font-bold text-sm sm:text-base text-slate-900 hover:text-emerald-800 cursor-pointer line-clamp-1 transition-colors"
          >
            {item.name}
          </h3>

          {/* Function Description Snippet */}
          <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
            {item.function_desc}
          </p>

          {/* Detail Spesifikasi Teknis Singkat */}
          {item.brand_model && (
            <div className="mt-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 flex items-start gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="font-semibold text-slate-800 block">Spesifikasi:</span>
                <span className="text-slate-600 line-clamp-1">{item.brand_model}</span>
              </div>
            </div>
          )}

          {/* Location & Stock Availability */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-slate-600 font-medium truncate pr-2">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{item.location || 'Ruang Lab Utama'}</span>
            </span>
            <span className="font-semibold text-slate-700 shrink-0">
              Tersedia: {item.available_stock}/{item.total_stock}
            </span>
          </div>
        </div>

        {/* Actions Button Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-12 gap-2">
          {/* Tombol Detail & Fungsi */}
          <button
            type="button"
            onClick={() => onViewDetail(item)}
            title="Lihat Rincian Spesifikasi & SOP Alat"
            className="col-span-3 py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Detail</span>
          </button>

          {/* Tombol Tambah ke Keranjang */}
          <button
            type="button"
            onClick={() => onAddToCart(item)}
            title={isInCart ? 'Sudah di Keranjang' : 'Tambah ke Keranjang'}
            disabled={item.status === 'Maintenance'}
            className={`col-span-3 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
              isInCart
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cart</span>
          </button>

          {/* Tombol Pinjam Langsung via WhatsApp */}
          <button
            type="button"
            onClick={() => onDirectBorrow(item)}
            disabled={item.status === 'Maintenance'}
            className="col-span-6 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 active:scale-95 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Pinjam via WA</span>
          </button>
        </div>

      </div>

    </div>
  );
};
