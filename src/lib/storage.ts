import type { Equipment, BorrowRequestRecord, LabSettings } from '../types';
import { defaultEquipmentList, initialLabSettings } from '../data/mockEquipment';

const MAX_HISTORY_ITEMS = 50;
const STORAGE_KEY = 'LAB_BORROW_HISTORY';

/**
 * Parsing JSON dengan pengamanan dari Prototype Pollution dan data korup
 */
const safeParseJSON = <T>(jsonString: string | null, fallback: T): T => {
  if (!jsonString) return fallback;
  try {
    const parsed = JSON.parse(jsonString, (key, value) => {
      // Pencegahan Prototype Pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        return undefined;
      }
      return value;
    });
    return parsed as T;
  } catch (e) {
    console.warn('Gagal membaca data dari storage lokal:', e);
    return fallback;
  }
};

// 1. Ambil Pengaturan Lab dari Environment Variables (Vite / Vercel Production)
export const getLabSettings = (): LabSettings => {
  return {
    id: 1,
    lab_name: import.meta.env.VITE_LAB_NAME || initialLabSettings.lab_name,
    campus_name: import.meta.env.VITE_CAMPUS_NAME || initialLabSettings.campus_name,
    department_name: import.meta.env.VITE_DEPARTMENT_NAME || initialLabSettings.department_name,
    whatsapp_number: import.meta.env.VITE_LAB_WHATSAPP_NUMBER || initialLabSettings.whatsapp_number,
    admin_name: import.meta.env.VITE_ADMIN_NAME || initialLabSettings.admin_name,
    operating_hours: import.meta.env.VITE_OPERATING_HOURS || initialLabSettings.operating_hours,
    logo_url: import.meta.env.VITE_LOGO_URL || initialLabSettings.logo_url,
  };
};

// 2. Ambil Katalog Alat Laboratorium
export const getEquipmentList = async (): Promise<Equipment[]> => {
  return defaultEquipmentList;
};

// 3. Catat Permohonan Peminjaman ke Log Riwayat Lokal Browser (Dengan Proteksi Kuota & Sanitasi)
export const recordBorrowRequest = async (request: BorrowRequestRecord): Promise<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existingLocal = safeParseJSON<BorrowRequestRecord[]>(raw, []);
    
    const recordId = request.id || `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newRecord: BorrowRequestRecord = {
      ...request,
      id: recordId,
      created_at: new Date().toISOString(),
    };

    // Batasi riwayat maksimal 50 entri untuk mencegah DoS / QuotaExceededError pada browser
    const boundedHistory = [newRecord, ...existingLocal].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boundedHistory));
    return recordId;
  } catch (err) {
    console.warn('Penyimpanan lokal tidak tersedia atau kuota penuh:', err);
    return `temp-${Date.now()}`;
  }
};

// 4. Ambil Riwayat Peminjaman (Log Sesi Terproteksi)
export const getBorrowHistory = async (): Promise<BorrowRequestRecord[]> => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return safeParseJSON<BorrowRequestRecord[]>(raw, []);
};

/**
 * 5. Enkripsi Satu Arah (SHA-256) menggunakan Web Crypto API native
 * Digunakan untuk memverifikasi password akses Log Pinjam tanpa menyimpan plaintext password.
 */
export const sha256Hex = async (text: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

/**
 * 6. Verifikasi Password Log Pinjam terhadap Hash di Environment Variable (VITE_LOG_PASSWORD_HASH)
 */
export const verifyLogPassword = async (inputPassword: string): Promise<boolean> => {
  const expectedHash = (import.meta.env.VITE_LOG_PASSWORD_HASH || '').trim().toLowerCase();
  if (!expectedHash) {
    return false;
  }
  const inputHash = await sha256Hex(inputPassword.trim());
  return inputHash === expectedHash;
};
