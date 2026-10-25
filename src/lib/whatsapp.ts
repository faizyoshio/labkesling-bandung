import type { BorrowFormData, CartItem, LabSettings } from '../types';

/**
 * Sanitasi nomor telepon agar hanya berisi digit numerik standar internasional (contoh: 6289646524262).
 * Mencegah karakter ilegal, injeksi parameter URL, atau nomor kosong.
 */
export const sanitizePhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.slice(1);
  }
  // Validasi format nomor telepon seluler Indonesia (62 + 8-13 digit)
  if (/^62[0-9]{8,13}$/.test(cleaned)) {
    return cleaned;
  }
  // Fallback ke kontak default PLP
  return '6289646524262';
};

/**
 * Sanitasi teks input pengguna dari karakter berbahaya dan tag HTML
 */
export const sanitizeText = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Hapus tag HTML
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Hapus control characters
    .trim();
};

/**
 * Menyusun teks pesan permohonan resmi dalam Bahasa Indonesia baku yang santun.
 * Tanpa elemen AI slop (tanpa deretan emoji dekoratif atau divider bar bertingkat).
 */
export const formatWhatsAppMessageText = (
  formData: BorrowFormData,
  items: CartItem[],
  settings: LabSettings
): string => {
  const cleanName = sanitizeText(formData.borrower_name);
  const cleanNim = sanitizeText(formData.borrower_nim);
  const cleanMajor = sanitizeText(formData.borrower_major);
  const cleanSupervisor = sanitizeText(formData.supervisor_name || '-');
  const cleanPurpose = sanitizeText(formData.purpose);
  const cleanNotes = sanitizeText(formData.notes || 'Tidak ada catatan tambahan. Mahasiswa bersedia mematuhi seluruh SOP K3 laboratorium Kesling.');
  const cleanBorrowDate = sanitizeText(formData.borrow_date);
  const cleanBorrowTime = sanitizeText(formData.borrow_time || '09:00');
  const cleanReturnDate = sanitizeText(formData.return_date);
  const cleanReturnTime = sanitizeText(formData.return_time || '16:00');

  const formattedItems = items
    .map((item, index) => {
      const cleanItemName = sanitizeText(item.equipment.name);
      const spec = item.equipment.capacity_spec ? ` (${sanitizeText(item.equipment.capacity_spec)})` : '';
      return `${index + 1}. ${cleanItemName}${spec} — ${item.quantity} unit`;
    })
    .join('\n');

  return `Yth. Bapak ${settings.admin_name}
${settings.lab_name}
${settings.department_name}
${settings.campus_name}

Selamat pagi/siang Pak Ade, mohon izin menyampaikan permohonan peminjaman alat laboratorium untuk keperluan praktikum/penelitian dengan rincian sebagai berikut:

*Identitas Peminjam:*
- Nama Lengkap: ${cleanName}
- NIM: ${cleanNim}
- Program Studi / Kelas: ${cleanMajor}
- Dosen Pengampu / Pembimbing: ${cleanSupervisor}
- Keperluan: ${cleanPurpose}

*Daftar Alat yang Dipinjam:*
${formattedItems}

*Jadwal Penggunaan Alat:*
- Rencana Pengambilan: ${cleanBorrowDate} pukul ${cleanBorrowTime} WIB
- Rencana Pengembalian: ${cleanReturnDate} pukul ${cleanReturnTime} WIB

*Catatan / Kesanggupan:*
${cleanNotes}

Mohon konfirmasi ketersediaan alat dan arahan waktu pengambilan di laboratorium. Terima kasih banyak atas waktu dan bantuannya, Pak.`;
};

/**
 * Menghasilkan tautan resmi WhatsApp dengan validasi skema HTTPS.
 */
export const generateWhatsAppLink = (
  formData: BorrowFormData,
  items: CartItem[],
  settings: LabSettings
): string => {
  const targetPhone = sanitizePhoneNumber(settings.whatsapp_number);
  const message = formatWhatsAppMessageText(formData, items, settings);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${targetPhone}?text=${encodedMessage}`;
};
