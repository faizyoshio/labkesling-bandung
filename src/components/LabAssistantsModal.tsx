import React, { useState } from 'react';
import type { LabAssistant } from '../types';
import { labAssistantsList } from '../data/mockEquipment';
import { X, Users, MessageCircle, Calendar, ShieldCheck, Award } from 'lucide-react';

interface LabAssistantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  campusName: string;
  departmentName: string;
  labName: string;
  adminName?: string;
  whatsappNumber?: string;
}

export const LabAssistantsModal: React.FC<LabAssistantsModalProps> = ({
  isOpen,
  onClose,
  campusName,
  departmentName,
  labName,
  adminName,
  whatsappNumber,
}) => {
  const [filter, setFilter] = useState<'all' | 'plp' | 'aslab'>('all');

  if (!isOpen) return null;

  const dynamicTeam: LabAssistant[] = labAssistantsList.map((item) => {
    if (item.id === 'aslab-2' && adminName && !adminName.includes('Belum Dikonfigurasi')) {
      const cleanName = adminName.replace(/\s*\(PLP\)\s*/i, '').trim();
      return {
        ...item,
        name: cleanName,
        phone: whatsappNumber || item.phone,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=0d9488&color=fff&size=128`,
      };
    }
    return {
      ...item,
      phone: item.phone || whatsappNumber || '',
    };
  });

  const filteredTeam: LabAssistant[] = dynamicTeam.filter((item: LabAssistant) => {
    if (filter === 'plp') return item.role.includes('Kepala') || item.role.includes('PLP');
    if (filter === 'aslab') return item.role.includes('Asisten');
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] z-10">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo-poltekkes-bandung.png"
              alt="Logo Poltekkes Kemenkes Bandung"
              className="h-8 sm:h-9 w-auto object-contain shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Struktur Pengelola & Asisten Laboratorium
                </h2>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Resmi Kesling
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {labName} • {departmentName} • {campusName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills & Sample Badge */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Semua Tim ({labAssistantsList.length})
            </button>
            <button
              onClick={() => setFilter('plp')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === 'plp'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Kepala Lab & PLP (3)
            </button>
            <button
              onClick={() => setFilter('aslab')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === 'aslab'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Asisten Mahasiswa (5)
            </button>
          </div>

          <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md font-semibold">
            📌 Format Sampel Template (Siap Diisi Nama Asli)
          </span>
        </div>

        {/* Team Grid */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredTeam.map((aslab) => {
              const isLead = aslab.role.includes('Kepala') || aslab.role.includes('PLP');

              return (
                <div
                  key={aslab.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isLead 
                      ? 'bg-gradient-to-br from-emerald-50/50 to-white border-emerald-200 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-emerald-300 shadow-2xs'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Avatar + Name + Role */}
                    <div className="flex items-start gap-3">
                      <img
                        src={aslab.avatar_url}
                        alt={aslab.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 shadow-2xs"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isLead
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {aslab.role}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mt-1 truncate">
                          {aslab.name}
                        </h4>
                        <p className="text-[11px] font-mono text-slate-500">
                          {aslab.nim_nip}
                        </p>
                      </div>
                    </div>

                    {/* Sub-Lab & Specialization */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                        <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{aslab.sub_lab}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        <b>Fokus:</b> {aslab.specialization}
                      </p>
                    </div>

                    {/* Shift Schedule */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span><b>Piket:</b> {aslab.shift_schedule}</span>
                    </div>
                  </div>

                  {/* Contact Action */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Konsultasi Praktikum & Alat
                    </span>
                    <a
                      href={`https://wa.me/${aslab.phone}?text=${encodeURIComponent(
                        `Halo ${aslab.name}, saya mahasiswa Jurusan Kesehatan Lingkungan Poltekkes Bandung, izin ingin berkonsultasi mengenai peminjaman alat dan praktikum di ${aslab.sub_lab}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Chat WA</span>
                    </a>
                  </div>

                </div>
              );
            })}
          </div>

          {/* K3 Alert Notice */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">
                Peringatan Tata Tertib Praktikum Laboratorium Kesehatan Lingkungan:
              </p>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                Seluruh mahasiswa yang meminjam alat atau beraktivitas di laboratorium diwajibkan memakai Jas Laboratorium Lengan Panjang, Sepatu Tertutup Anti-Selip, serta APD pendukung (Masker, Kacamata Goggles, Sarung Tangan Nitril). Peminjaman alat wajib diverifikasi oleh Asisten Lab piket atau PLP yang bertugas.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Total 8 Personel Aktif Unit Laboratorium</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
