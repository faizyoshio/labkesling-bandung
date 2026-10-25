import React, { useEffect, useState } from 'react';
import type { BorrowRequestRecord } from '../types';
import { getBorrowHistory } from '../lib/storage';
import { X, History, Calendar, User, BookOpen, RefreshCw, CheckCircle2 } from 'lucide-react';

interface AdminLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLogModal: React.FC<AdminLogModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<BorrowRequestRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getBorrowHistory();
      setLogs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Log Riwayat Peminjaman Alat
              </h2>
              <p className="text-xs text-slate-500">
                Log Permohonan Pengajuan Peminjaman via WhatsApp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              title="Refresh Data"
              className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {logs.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <History className="w-12 h-12 mx-auto text-slate-300" />
              <h4 className="font-bold text-slate-700 text-sm">Belum Ada Riwayat Peminjaman</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Setelah formulir peminjaman dikirimkan via WhatsApp, salinan permohonan akan otomatis tersimpan di sini.
              </p>
            </div>
          ) : (
            logs.map((log, index) => (
              <div
                key={log.id || index}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 hover:border-emerald-300 space-y-3 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-bold text-sm text-slate-900">{log.borrower_name}</span>
                    <span className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      NIM: {log.borrower_nim}
                    </span>
                    <span className="text-xs text-slate-600">({log.borrower_major})</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3" />
                    {log.status || 'Terkirim ke WhatsApp'}
                  </span>
                </div>

                {/* Items detail */}
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                    Daftar Alat:
                  </span>
                  <div className="grid sm:grid-cols-2 gap-1.5 pt-1">
                    {log.items?.map((it, idx) => (
                      <div
                        key={idx}
                        className="px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 flex justify-between"
                      >
                        <span className="truncate font-medium">{it.name}</span>
                        <span className="font-bold text-emerald-700 shrink-0 ml-2">{it.quantity} unit</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meta details: schedule & purpose */}
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span><b>Pinjam:</b> {log.borrow_date} ({log.borrow_time || '09:00'})</span>
                    <span className="text-slate-300">→</span>
                    <span><b>Kembali:</b> {log.return_date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate"><b>Keperluan:</b> {log.purpose}</span>
                  </div>
                </div>

                {log.supervisor_name && (
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Dosen/Pembimbing: {log.supervisor_name}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {logs.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Hapus seluruh catatan riwayat peminjaman sesi lokal ini?')) {
                  localStorage.removeItem('LAB_BORROW_HISTORY');
                  setLogs([]);
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
            >
              Hapus Riwayat Sesi
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
