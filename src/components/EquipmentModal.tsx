import React from 'react';
import type { Equipment } from '../types';
import { X, Send, Plus, MapPin, CheckCircle2, AlertTriangle, ShieldCheck, FileText, Package, Sliders } from 'lucide-react';

interface EquipmentModalProps {
  item: Equipment | null;
  onClose: () => void;
  onDirectBorrow: (item: Equipment) => void;
  onAddToCart: (item: Equipment) => void;
  isInCart: boolean;
}

export const EquipmentModal: React.FC<EquipmentModalProps> = ({
  item,
  onClose,
  onDirectBorrow,
  onAddToCart,
  isInCart,
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] z-10">
        
        {/* Header with Close Button */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
              {item.category}
            </span>
            {item.capacity_spec && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
                {item.capacity_spec}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Tutup Detail Alat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Main Visual & Key Stats */}
          <div className="grid sm:grid-cols-12 gap-5 items-center">
            <div className="sm:col-span-5 h-52 rounded-xl overflow-hidden bg-white border border-slate-200 p-3 flex items-center justify-center">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-contain object-center"
              />
            </div>
            
            <div className="sm:col-span-7 space-y-2.5">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {item.name}
              </h2>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span><strong>Material:</strong> {item.material || 'Material standar laboratorium'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span><strong>Lokasi:</strong> {item.location || 'Ruang Lab Utama'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.status === 'Tersedia' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <span>
                    <strong>Status:</strong> {item.available_stock} dari {item.total_stock} unit ({item.status})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Tabel Rincian Spesifikasi Teknis Alat */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Sliders className="w-4 h-4 text-emerald-700" />
              <span>Rincian Spesifikasi Teknis Alat</span>
            </div>
            
            <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <tbody>
                  {item.brand_model && (
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      <td className="py-2.5 px-3.5 font-semibold text-slate-700 w-1/3">Merk & Model</td>
                      <td className="py-2.5 px-3.5 text-slate-900 font-medium">{item.brand_model}</td>
                    </tr>
                  )}
                  {item.measurement_range && (
                    <tr className="border-b border-slate-100">
                      <td className="py-2.5 px-3.5 font-semibold text-slate-700">Rentang Ukur / Kapasitas</td>
                      <td className="py-2.5 px-3.5 text-slate-800">{item.measurement_range}</td>
                    </tr>
                  )}
                  {item.accuracy_resolution && (
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      <td className="py-2.5 px-3.5 font-semibold text-slate-700">Ketelitian / Resolusi</td>
                      <td className="py-2.5 px-3.5 text-slate-800">{item.accuracy_resolution}</td>
                    </tr>
                  )}
                  {item.material && (
                    <tr className="border-b border-slate-100">
                      <td className="py-2.5 px-3.5 font-semibold text-slate-700">Bahan Konstruksi</td>
                      <td className="py-2.5 px-3.5 text-slate-800">{item.material}</td>
                    </tr>
                  )}
                  {item.standard_method && (
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      <td className="py-2.5 px-3.5 font-semibold text-slate-700">Standar Uji / Acuan</td>
                      <td className="py-2.5 px-3.5 text-slate-800">{item.standard_method}</td>
                    </tr>
                  )}
                  {item.power_calibration && (
                    <tr className="border-b border-slate-100">
                      <td className="py-2.5 px-3.5 font-semibold text-slate-700">Catu Daya & Kalibrasi</td>
                      <td className="py-2.5 px-3.5 text-slate-800">{item.power_calibration}</td>
                    </tr>
                  )}
                  {item.location && (
                    <tr className="bg-slate-50/60">
                      <td className="py-2.5 px-3.5 font-semibold text-slate-700">Posisi Rak Penyimpanan</td>
                      <td className="py-2.5 px-3.5 text-slate-800">{item.location}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Fungsi Utama Alat */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>Fungsi & Kegunaan Praktikum</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {item.function_desc}
            </div>
          </div>

          {/* Section: SOP & Keselamatan */}
          {item.sop_notes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Standar Operasional Prosedur (SOP) & K3 Lab</span>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-amber-950 leading-relaxed whitespace-pre-line">
                {item.sop_notes}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={() => {
              onAddToCart(item);
            }}
            disabled={item.status === 'Maintenance'}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              isInCart
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{isInCart ? 'Sudah di Keranjang' : 'Tambah ke Keranjang'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 rounded-lg text-center"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onDirectBorrow(item);
              }}
              disabled={item.status === 'Maintenance'}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Pinjam Alat Ini via WA</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
