import React, { useEffect, useState } from 'react';
import type { BorrowRequestRecord } from '../types';
import { getBorrowHistory, verifyLogPassword } from '../lib/storage';
import { X, History, Calendar, User, BookOpen, RefreshCw, CheckCircle2, Lock, Eye, EyeOff, ShieldAlert, LogOut } from 'lucide-react';

interface AdminLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AUTH_SESSION_KEY = 'LAB_ADMIN_LOG_UNLOCKED';

export const AdminLogModal: React.FC<AdminLogModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<BorrowRequestRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // State autentikasi password terenkripsi SHA-256
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [verifying, setVerifying] = useState(false);

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
    if (isOpen && isUnlocked) {
      loadData();
    }
    if (!isOpen) {
      setPasswordInput('');
      setAuthError('');
    }
  }, [isOpen, isUnlocked]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setAuthError('Masukkan kata sandi pengelola laboratorium.');
      return;
    }

    setVerifying(true);
    setAuthError('');

    try {
      const isValid = await verifyLogPassword(passwordInput);
      if (isValid) {
        setIsUnlocked(true);
        try {
          sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
        } catch {
          // Abaikan jika sessionStorage diblokir
        }
        setPasswordInput('');
      } else {
        const hasEnvConfigured = Boolean((import.meta.env.VITE_LOG_PASSWORD_HASH || '').trim());
        if (!hasEnvConfigured) {
          setAuthError('VITE_LOG_PASSWORD_HASH belum dikonfigurasi pada Environment Variables (.env / Vercel).');
        } else {
          setAuthError('Kata sandi salah. Akses khusus PLP & Asisten Laboratorium.');
        }
      }
    } catch {
      setAuthError('Gagal memverifikasi enkripsi kata sandi.');
    } finally {
      setVerifying(false);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    try {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    } catch {
      // Abaikan
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="animate-modal-pop relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              {isUnlocked ? <History className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Log Riwayat Peminjaman Alat
              </h2>
              <p className="text-xs text-slate-500">
                {isUnlocked
                  ? 'Log Permohonan Pengajuan Peminjaman via WhatsApp'
                  : 'Area Terproteksi — Khusus PLP & Pengelola Laboratorium'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isUnlocked && (
              <>
                <button
                  onClick={loadData}
                  disabled={loading}
                  title="Refresh Data"
                  className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
                </button>
                <button
                  onClick={handleLock}
                  title="Kunci Kembali Log Pinjam"
                  className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-slate-200 flex items-center gap-1 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Kunci</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content: Password Gate vs Log List */}
        {!isUnlocked ? (
          <form onSubmit={handleUnlock} className="p-6 sm:p-8 space-y-5 max-w-md mx-auto w-full my-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Verifikasi Akses Pengelola Lab
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Masukkan kata sandi pengelola untuk membuka catatan riwayat peminjaman alat laboratorium.
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="log-password" className="block text-xs font-bold text-slate-700">
                Kata Sandi Akses Log
              </label>
              <div className="relative">
                <input
                  id="log-password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="Masukkan kata sandi..."
                  autoFocus
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              {verifying ? 'Memverifikasi Enkripsi...' : 'Buka Log Peminjaman'}
            </button>
          </form>
        ) : (
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
        )}

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {isUnlocked && logs.length > 0 ? (
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
