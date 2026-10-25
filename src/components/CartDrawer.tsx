import React from 'react';
import type { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onProceedToBorrow: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToBorrow,
}) => {
  if (!isOpen) return null;

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="animate-drawer-slide w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Keranjang Pinjam</h3>
                <p className="text-xs text-slate-500">{items.length} jenis alat ({totalUnits} total unit)</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-semibold text-slate-700 text-sm">Keranjang Masih Kosong</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Silakan pilih alat laboratorium dari katalog lalu klik &apos;+ Keranjang&apos; atau &apos;Pinjam Sekarang&apos;.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.equipment.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/80 gap-3"
                >
                  <img
                    src={item.equipment.image_url}
                    alt={item.equipment.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-xs text-slate-900 truncate">
                      {item.equipment.name}
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.equipment.capacity_spec || item.equipment.category}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-medium">
                      {item.equipment.location || 'Lab Kimia'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                      <button
                        onClick={() => onUpdateQuantity(item.equipment.id, Math.max(1, item.quantity - 1))}
                        className="p-1 hover:bg-slate-100 text-slate-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-bold text-slate-800 text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.equipment.id, item.quantity + 1)}
                        className="p-1 hover:bg-slate-100 text-slate-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.equipment.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>Total Permohonan:</span>
                <span className="font-bold text-slate-900">{totalUnits} Unit Alat</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToBorrow();
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
              >
                <span>Lanjut ke Formulir & WA</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClearCart}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
              >
                Kosongkan Keranjang
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
