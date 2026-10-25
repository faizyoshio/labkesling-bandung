import React, { useState, useRef } from 'react';
import type { CartItem, LabSettings, BorrowFormData } from '../types';
import { generateWhatsAppLink, formatWhatsAppMessageText, sanitizeText } from '../lib/whatsapp';
import { recordBorrowRequest } from '../lib/storage';
import { X, Send, Eye, Edit3, Trash2, Plus, Minus, AlertCircle } from 'lucide-react';

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  settings: LabSettings;
  onSuccess: () => void;
}

export const BorrowModal: React.FC<BorrowModalProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  settings,
  onSuccess,
}) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextTwoDays = new Date(today);
  nextTwoDays.setDate(nextTwoDays.getDate() + 2);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const [formData, setFormData] = useState<BorrowFormData>({
    borrower_name: '',
    borrower_nim: '',
    borrower_major: 'Sarjana Terapan Sanitasi Lingkungan (Tk. 3)',
    supervisor_name: '',
    purpose: 'Riset Skripsi / Tugas Akhir Kesling',
    borrow_date: formatDate(tomorrow),
    borrow_time: '09:00',
    return_date: formatDate(nextTwoDays),
    return_time: '16:00',
    notes: '',
  });

  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const lastSubmitTime = useRef<number>(0);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Input sanitization & character limits
    let cleanVal = value;
    if (name === 'borrower_name' && cleanVal.length > 80) cleanVal = cleanVal.slice(0, 80);
    if (name === 'borrower_nim' && cleanVal.length > 25) cleanVal = cleanVal.slice(0, 25);
    if (name === 'supervisor_name' && cleanVal.length > 80) cleanVal = cleanVal.slice(0, 80);
    if (name === 'purpose' && cleanVal.length > 150) cleanVal = cleanVal.slice(0, 150);
    if (name === 'notes' && cleanVal.length > 400) cleanVal = cleanVal.slice(0, 400);

    setFormData((prev) => ({
      ...prev,
      [name]: cleanVal,
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSendToWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting: cegah spamming submission dalam jeda < 3 detik
    const now = Date.now();
    if (now - lastSubmitTime.current < 3000) {
      setErrorMessage('Mohon tunggu sejenak sebelum mengajukan permohonan kembali.');
      return;
    }
    lastSubmitTime.current = now;

    // Validasi Data
    if (items.length === 0) {
      setErrorMessage('Daftar alat yang dipinjam masih kosong.');
      return;
    }
    if (!formData.borrower_name.trim()) {
      setErrorMessage('Nama lengkap peminjam wajib diisi.');
      return;
    }
    if (!formData.borrower_nim.trim()) {
      setErrorMessage('Nomor Induk Mahasiswa (NIM) wajib diisi.');
      return;
    }
    if (!formData.borrower_major.trim()) {
      setErrorMessage('Program studi & tingkat wajib dipilih.');
      return;
    }
    if (!settings.whatsapp_number || !settings.whatsapp_number.trim()) {
      setErrorMessage('Nomor WhatsApp PLP belum dikonfigurasi pada Environment Variables (VITE_LAB_WHATSAPP_NUMBER).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Generate link WhatsApp dengan sanitasi
      const waUrl = generateWhatsAppLink(formData, items, settings);

      // 2. Simpan permohonan ke log riwayat sesi lokal
      await recordBorrowRequest({
        ...formData,
        borrower_name: sanitizeText(formData.borrower_name),
        borrower_nim: sanitizeText(formData.borrower_nim),
        items: items.map(i => ({
          equipment_id: i.equipment.id,
          name: sanitizeText(i.equipment.name),
          capacity_spec: i.equipment.capacity_spec ? sanitizeText(i.equipment.capacity_spec) : undefined,
          quantity: i.quantity,
        })),
        status: 'Menunggu Konfirmasi WA',
      });

      // 3. Pengamanan Buka Tab Baru: Strict origin verification & reverse tabnabbing defense
      if (waUrl.startsWith('https://wa.me/')) {
        const newWindow = window.open(waUrl, '_blank', 'noopener,noreferrer');
        if (newWindow) {
          newWindow.opener = null;
        }
      }

      setIsSubmitting(false);
      onSuccess();
    } catch (err) {
      console.error('Error saat submit peminjaman:', err);
      setIsSubmitting(false);
      const waUrl = generateWhatsAppLink(formData, items, settings);
      if (waUrl.startsWith('https://wa.me/')) {
        const fallbackWin = window.open(waUrl, '_blank', 'noopener,noreferrer');
        if (fallbackWin) fallbackWin.opener = null;
      }
      onSuccess();
    }
  };

  const previewText = formatWhatsAppMessageText(formData, items, settings);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] z-10">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <img
              src="/logo-poltekkes-bandung.png"
              alt="Logo Poltekkes Bandung"
              className="h-8 w-auto object-contain shrink-0"
            />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Formulir Peminjaman Alat Laboratorium
              </h2>
              <p className="text-[11px] text-slate-500">
                Tujuan WhatsApp:{' '}
                <strong className="text-slate-700">
                  {settings.whatsapp_number ? `+${settings.whatsapp_number}` : 'Belum diatur di ENV'}
                </strong>{' '}
                ({settings.admin_name})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Switcher */}
            <div className="flex p-0.5 bg-slate-200 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                  activeTab === 'form'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Formulir</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                  activeTab === 'preview'
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Pratinjau</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              aria-label="Tutup Formulir"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Daftar Alat yang Dipinjam */}
          <div className="bg-slate-50 rounded-xl p-3.5 sm:p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-700">
                Alat yang Dipinjam ({items.length} item)
              </h3>
              <span className="text-[11px] text-slate-500 font-semibold">
                Total unit: {items.reduce((acc, curr) => acc + curr.quantity, 0)}
              </span>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-400">
                Daftar alat masih kosong. Silakan pilih alat dari katalog terlebih dahulu.
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.equipment.id}
                    className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <img
                        src={item.equipment.image_url}
                        alt={item.equipment.name}
                        className="w-10 h-10 rounded-md object-cover shrink-0"
                      />
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 truncate">
                          {item.equipment.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.equipment.capacity_spec || item.equipment.category} • {item.equipment.location}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-slate-50">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.equipment.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                          aria-label="Kurangi jumlah"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.equipment.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                          aria-label="Tambah jumlah"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.equipment.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Hapus dari daftar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Tab 1: Form Inputs */}
          {activeTab === 'form' && (
            <form onSubmit={handleSendToWhatsApp} className="space-y-4">
              
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Mahasiswa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="borrower_name"
                    required
                    maxLength={80}
                    placeholder="Contoh: Muhammad Raihan"
                    value={formData.borrower_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-emerald-700 outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIM Mahasiswa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="borrower_nim"
                    required
                    maxLength={25}
                    placeholder="Contoh: P17333121401"
                    value={formData.borrower_nim}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-emerald-700 outline-hidden transition-colors"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Program Studi & Tingkat <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="borrower_major"
                    value={formData.borrower_major}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-emerald-700 outline-hidden transition-colors"
                  >
                    <option value="Sarjana Terapan Sanitasi Lingkungan (Tk. 1)">D-IV Sanitasi Lingkungan (Tingkat 1)</option>
                    <option value="Sarjana Terapan Sanitasi Lingkungan (Tk. 2)">D-IV Sanitasi Lingkungan (Tingkat 2)</option>
                    <option value="Sarjana Terapan Sanitasi Lingkungan (Tk. 3)">D-IV Sanitasi Lingkungan (Tingkat 3)</option>
                    <option value="Sarjana Terapan Sanitasi Lingkungan (Tk. 4)">D-IV Sanitasi Lingkungan (Tingkat 4)</option>
                    <option value="D-III Sanitasi (Tingkat 1)">D-III Sanitasi (Tingkat 1)</option>
                    <option value="D-III Sanitasi (Tingkat 2)">D-III Sanitasi (Tingkat 2)</option>
                    <option value="D-III Sanitasi (Tingkat 3)">D-III Sanitasi (Tingkat 3)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dosen Pengampu / Pembimbing
                  </label>
                  <input
                    type="text"
                    name="supervisor_name"
                    maxLength={80}
                    placeholder="Contoh: Dr. Ir. H. Bambang, M.Kes"
                    value={formData.supervisor_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-emerald-700 outline-hidden transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keperluan Praktikum / Riset <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="purpose"
                  required
                  maxLength={150}
                  placeholder="Contoh: Uji Analisis Kesadahan Air Tanah & Titrasi Permanganat"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-emerald-700 outline-hidden transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Tgl Ambil
                  </label>
                  <input
                    type="date"
                    name="borrow_date"
                    required
                    value={formData.borrow_date}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Jam Ambil
                  </label>
                  <input
                    type="time"
                    name="borrow_time"
                    value={formData.borrow_time}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Tgl Kembali
                  </label>
                  <input
                    type="date"
                    name="return_date"
                    required
                    value={formData.return_date}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Jam Kembali
                  </label>
                  <input
                    type="time"
                    name="return_time"
                    value={formData.return_time}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  maxLength={400}
                  placeholder="Contoh: Membutuhkan buret asam tambahan dan pipet ukur steril..."
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-emerald-700 outline-hidden transition-colors"
                />
              </div>

            </form>
          )}

          {/* Tab 2: WhatsApp Live Preview */}
          {activeTab === 'preview' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Draf surat permohonan yang akan dikirim:</span>
                <span className="font-semibold text-slate-800">Tujuan: +{settings.whatsapp_number}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  {previewText}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSendToWhatsApp}
            disabled={isSubmitting || items.length === 0}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Meneruskan ke WhatsApp...' : 'Kirim via WhatsApp'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
