import React from 'react';
import type { LabSettings } from '../types';
import { ArrowRight, Users, MapPin, Phone, Building2, ClipboardCheck, Clock, ShieldCheck } from 'lucide-react';

interface HeroProps {
  settings: LabSettings;
  onQuickPickErlenmeyer: () => void;
  onOpenAssistants: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  settings, 
  onQuickPickErlenmeyer, 
  onOpenAssistants 
}) => {
  const formatDisplayPhone = (num: string) => {
    const digits = (num || '').replace(/\D/g, '');
    if (!digits) return 'Belum diatur di ENV';
    if (digits.startsWith('62')) {
      const rest = digits.slice(2);
      if (rest.length === 11) {
        return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`;
      }
      if (rest.length === 10) {
        return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 6)}-${rest.slice(6)}`;
      }
    }
    return `+${digits}`;
  };

  return (
    <section className="bg-white border-b border-slate-200/90 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Copy Column */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Campus & Department Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>{settings.campus_name} • {settings.department_name}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Katalog Peralatan & Layanan Peminjaman Laboratorium Terpadu
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              Sistem inventarisasi dan reservasi alat praktikum mahasiswa Sanitasi Lingkungan. Akses spesifikasi alat, lokasi penyimpanan rak lab, dan panduan K3. Permohonan langsung diteruskan ke Pranata Laboratorium Pendidikan (PLP) via WhatsApp resmi.
            </p>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onQuickPickErlenmeyer}
                className="w-full sm:w-auto px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors active:scale-[0.98]"
              >
                <span>Pinjam Labu Erlenmeyer 500 mL</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenAssistants}
                className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300/80 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
              >
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Struktur Tim Pengelola Lab</span>
              </button>
            </div>

            {/* Contact & Location Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>PLP: <strong className="text-slate-800">{settings.admin_name}</strong> ({formatDisplayPhone(settings.whatsapp_number)})</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Kampus Kesling Cimahi</span>
              </div>
            </div>

            {/* Factual Information Row */}
            <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-200 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>SOP K3 Laboratorium Terstandar</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Layanan Jam Kerja (08.00–16.00)</span>
              </div>
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Verifikasi Terbuka Tanpa Login</span>
              </div>
            </div>

          </div>

          {/* Operational Guidance Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                  Prosedur Peminjaman Praktikum
                </h2>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-md">
                  Sanitasi Lingkungan
                </span>
              </div>

              <ol className="space-y-3.5 pt-3.5 text-xs text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-800 block font-semibold">Tentukan Alat Praktikum</strong>
                    <span className="text-slate-500 text-[11px]">
                      Cari alat berdasarkan parameter uji (Air, Udara/K3, Vektor, Mikrobiologi).
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-800 block font-semibold">Lengkapi Data Peminjam</strong>
                    <span className="text-slate-500 text-[11px]">
                      Isi Nama, NIM, Mata Kuliah Praktikum/Dosen, serta jadwal pengambilan alat.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-800 block font-semibold">Pengiriman Permohonan Resmi</strong>
                    <span className="text-slate-500 text-[11px]">
                      Sistem menyusun draf surat permohonan santun dan langsung membuka chat WhatsApp PLP.
                    </span>
                  </div>
                </li>
              </ol>

              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Pengambilan Alat:</span>
                <span className="font-semibold text-slate-800">Ruang Inventaris Lab Kesling Cimahi</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
