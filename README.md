# Sistem Informasi Katalog & Peminjaman Alat Laboratorium Terpadu
### Poltekkes Kemenkes Bandung — Jurusan Kesehatan Lingkungan (Sanitasi)

Aplikasi web portal resmi inventarisasi peralatan laboratorium, panduan standar operasional prosedur (SOP K3), dan reservasi peminjaman alat praktikum/riset mahasiswa yang terhubung langsung ke Pranata Laboratorium Pendidikan (PLP) via WhatsApp resmi.

---

## Fitur Utama

1. **Katalog 20 Alat Laboratorium Kesehatan Lingkungan**:
   - Foto asli beresolusi tinggi tersimpan secara lokal tanpa dependensi tautan eksternal.
   - Meliputi 5 pilar keilmuan sanitasi:
     - *Glassware & Gravimetri* (Labu Erlenmeyer 500 mL, Buret Asam 50 mL, Desikator Kaca 240 mm)
     - *Kualitas Air & Limbah* (DO Meter Portabel, Turbidimeter 0–1000 NTU, Benchtop pH Meter, Spektrofotometer UV-Vis, Hotplate Magnetic Stirrer)
     - *Udara, Kebisingan & K3* (Sound Level Meter Tipe 2, Digital Lux Meter, Vane Anemometer, Midget Impinger Gas Sampler)
     - *Vektor & Mikrobiologi* (Autoclave Vertikal 50 L, Inkubator Bakteriologi 37°C, Digital Colony Counter, Mikroskop Binokuler Olympus CX23, Mesin Thermal Fogging)
     - *Alat Ukur Sanitasi Lapangan* (Digital Food Core Thermometer, Sanitarian Field Kit, Mikropipet 100–1000 µL)

2. **Rincian Spesifikasi Teknis Terstandar**:
   - Setiap alat dilengkapi merk/model (Iwaki Pyrex, Hach, Thermo Scientific, Olympus, Memmert, Testo), rentang ukur, akurasi/resolusi, bahan konstruksi, catu daya, dan metode uji acuan (*SNI*, *Permenkes*, *APHA*, *ISO*).
   - Memudahkan mahasiswa menyusun rujukan metodologi pada laporan praktikum atau tugas akhir/skripsi.

3. **Pengajuan Peminjaman Cepat (1-Klik via WhatsApp)**:
   - Klik satu tombol pada alat yang diinginkan (misal: **Labu Erlenmeyer 500 mL**), formulir peminjaman otomatis terisi.
   - Generator otomatis menyusun draf surat permohonan resmi dalam Bahasa Indonesia baku yang santun dan membuka chat WhatsApp PLP sesuai nomor yang diatur pada `.env`.
   - Mendukung **Keranjang Peminjaman Multi-Alat** untuk meminjam beberapa instrumen sekaligus dalam 1 permohonan.

4. **Struktur Tim Pengelola & Asisten Laboratorium**:
   - Menampilkan profil kepala unit, pranata laboratorium pendidikan (PLP), serta asisten mahasiswa berdasarkan divisi laboratorium sanitasi.

5. **Log Sesi Peminjaman Digital**:
   - Salinan permohonan yang telah diajukan otomatis tersimpan di log sesi browser lokal (`localStorage`) dengan proteksi keamanan kuota memori.

6. **Keamanan & Standar Produksi Ketat**:
   - Bebas dari kerentanan *Reverse Tabnabbing* / *Open Redirect* pada tautan WhatsApp.
   - Proteksi *Prototype Pollution* dan *XSS input sanitization*.
   - Konfigurasi header keamanan produksi (`CSP`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`) via `vercel.json`.

---

## Panduan Instalasi & Menjalankan Lokal

### Prasyarat
- Node.js (v18 ke atas disarankan)
- npm

### Langkah Menjalankan
```bash
# 1. Clone repositori ini
git clone https://github.com/<username>/<nama-repo>.git
cd <nama-repo>

# 2. Salin template variabel lingkungan
cp .env.example .env

# 3. Instal dependensi
npm install

# 4. Jalankan server pengembangan lokal
npm run dev
```

Buka peramban pada alamat lokal: **`http://localhost:5173`**.

---

## Variabel Lingkungan (`.env`)

Seluruh identitas laboratorium dan kontak PIC dikelola melalui Environment Variables:

| Variabel | Deskripsi | Default |
| :--- | :--- | :--- |
| `VITE_LAB_NAME` | Nama Laboratorium | `Laboratorium Terpadu Kesehatan Lingkungan` |
| `VITE_CAMPUS_NAME` | Nama Kampus | `Poltekkes Kemenkes Bandung` |
| `VITE_DEPARTMENT_NAME` | Nama Jurusan | `Jurusan Kesehatan Lingkungan (Sanitasi)` |
| `VITE_LAB_WHATSAPP_NUMBER` | Nomor WA PLP (format intl) | `628xxxxxxxxxx` |
| `VITE_ADMIN_NAME` | Nama PLP / Penanggung Jawab | `Nama Admin PLP (PLP)` |
| `VITE_OPERATING_HOURS` | Jam Operasional Lab | `Senin - Jumat: 08:00 - 16:00 WIB (Kampus Cimahi)` |
| `VITE_LOGO_URL` | Berkas Logo Kampus | `/logo-poltekkes-bandung.png` |

---

## Panduan Deploy ke Vercel

1. Buat repositori baru di GitHub dan lakukan `git push` kode proyek ini.
2. Buka dashboard [Vercel](https://vercel.com) dan pilih **Add New $\rightarrow$ Project**.
3. Hubungkan repositori GitHub yang baru dibuat.
4. Pada kolom **Project Name**, pilih nama domain yang diinginkan, misalnya:
   - `silab-kesling-poltekkesbdg` (menjadi `silab-kesling-poltekkesbdg.vercel.app`)
5. Pada bagian **Environment Variables**, masukkan seluruh variabel dari berkas `.env.example`.
6. Klik tombol **Deploy**. Aplikasi akan otomatis online dan siap diakses.

---

## Lisensi & Hak Cipta
Hak cipta © Jurusan Kesehatan Lingkungan, Poltekkes Kemenkes Bandung. Dikembangkan untuk menunjang kegiatan tridharma perguruan tinggi dan kemudahan praktikum mahasiswa sanitasi.
