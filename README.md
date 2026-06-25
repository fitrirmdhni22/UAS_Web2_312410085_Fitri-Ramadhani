# 📚 E-Library — Sistem Informasi Rental Buku & Komik Digital

UAS Pemrograman Web 2
**Arsitektur:** Decoupled (Backend CodeIgniter 4 RESTful API + Frontend VueJS 3 SPA)

---

## 📖 Deskripsi Proyek

E-Library adalah sistem informasi untuk mengelola data buku/komik, kategori genre, data penulis/penerbit, anggota, serta transaksi peminjaman (rental). Aplikasi memisahkan penuh antara Backend (REST API) dan Frontend (Single Page Application), sesuai ketentuan Decoupled Architecture.

# Tema yang dipilih: Sistem Informasi Rental Buku / Komik Digital (E-Library)

---

## 🧱 Teknologi yang Digunakan

| Layer       | Teknologi                                              |
|-------------|----------------------------------------------------------|
| Backend     | PHP CodeIgniter 4 (Resource Controller, RESTful API)     |
| Frontend    | VueJS 3 (CDN) + Vue Router 4 (SPA, No Hard Reload)        |
| UI Styling  | TailwindCSS (CDN, utility-first)                          |
| HTTP Client | Axios (dengan Request & Response Interceptor)            |
| Database    | MySQL / MariaDB                                          |
| Auth        | Bearer Token + CodeIgniter Filters                         |

---

## 🗂️ Struktur Repositori

```
UAS_Web2_NIM_Nama/
├── backend-api/        → Seluruh kode CodeIgniter 4 (Controllers, Models, Filters, Routes, Migrations, Seeds)
├── frontend-spa/        → index.html, komponen VueJS, Axios interceptor, router
├── database_elibrary.sql → Skema database + seed data (alternatif raw SQL)
└── README.md             → Dokumentasi ini
```

---

## 🗃️ Skema Relasi Database

6 tabel saling berelasi:

- **users** — akun admin/member (login & register)
- **kategori** — genre buku/komik
- **penulis** — data penulis & penerbit
- **buku** — data buku (relasi ke `kategori` & `penulis`)
- **anggota** — data anggota peminjam
- **peminjaman** — transaksi rental (relasi ke `buku` & `anggota`)

> <img width="698" height="538" alt="image" src="https://github.com/user-attachments/assets/22375481-9b2b-435a-96d6-75f7464a19ba" />

---

## 🔌 Daftar Endpoint API

Ringkasan proteksi:
- **GET** (list/detail) → publik, tanpa token.
- **POST / PUT / DELETE** (tambah/edit/hapus) → wajib `Authorization: Bearer <token>`.

---

## 🔐 Bukti Proteksi Token (Error 401)

> <img width="1365" height="583" alt="image" src="https://github.com/user-attachments/assets/a1b6f778-684e-47b6-beea-867e60667994" />

---

## 🖥️ Screenshot Antarmuka Aplikasi

# Halaman Login
<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/a7884f83-4523-4e04-8ec5-569de028aeff" />

# Halaman Dashboard Admin
<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/5df7e6e2-a0b3-4821-a4df-e2c3a1703f5a" />

<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/f2a152a7-0c9d-4c58-adbd-c4506886c703" />

# Form Modal Tambah/Edit Data Buku
<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/81663fed-694e-4666-912b-19937b261546" />

# Form Modal Tambah/Edit Data Kategori
<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/0c859c27-ec8a-4e53-8875-4f1f10bde4cb" />

# Form Modal Tambah/Edit Data Penulis
<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/637f985d-da4c-4920-998f-21a31f705640" />

# Form Modal Tambah/Edit Data Anggota
<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/4560e2d8-aa14-445d-8058-5e097c9776d1" />

# Form Modal Tambah/Edit Data Peminjaman
<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/eab39767-6f8c-4ded-b051-38b4fcdfcff0" />

# Halaman Data Buku
<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/425b2160-49f5-446e-9f5d-f22c51610086" />

# Halaman Data Kategori
<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/dc0a349c-289a-49a8-b926-73d915983a8e" />

# Halaman Data Penulis
<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/344b542e-3166-4026-b6c7-52c1230a5ef5" />

# Halaman Data Anggota
<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/5bfc22fd-c77c-4ca5-b038-7d649e216b40" />

# Halaman Data Peminjaman
<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/d92b5711-0995-480f-bac0-eeab0de6c66e" />

# Tampilan Pop-up Notifikasi Sukses
<img width="1024" height="539" alt="image" src="https://github.com/user-attachments/assets/b659d00b-11de-4e5a-af48-ddcec34e3690" />

# Tampilan Pop-up Konfirmasi Logout
<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/25e75d18-7d1a-48fa-aa39-10816ebb6af6" />

# Tampilan Pop-up Peringatan Sesi Habis
<img width="1366" height="720" alt="image" src="https://github.com/user-attachments/assets/7096b1c1-1ffd-48db-952e-c431090aa9dd" />

---

## ⚙️ Petunjuk Instalasi & Menjalankan Proyek Lokal

### Backend (CodeIgniter 4)

```bash
composer create-project codeigniter4/appstarter backend-api
# lalu timpa folder app/ dengan app/ dari backend-api/
cp env .env   # sesuaikan kredensial database
php spark migrate
php spark db:seed DatabaseSeeder
php spark serve
```
Backend akan berjalan di `http://localhost:8080`

### Frontend (VueJS 3 SPA)
Karena frontend murni CDN (tanpa build tool/Node.js), cukup:
1. Buka folder `frontend-spa/`
2. Pastikan `js/config.js` → `API_BASE_URL` mengarah ke alamat backend (default: `http://localhost:8080/api`)
3. Jalankan dengan **Live Server** (ekstensi VSCode) atau web server statis apapun, lalu buka `index.html`

> ⚠️ Jangan buka `index.html` langsung lewat `file://` di browser karena
> beberapa fitur (fetch API, dsb) butuh server HTTP. Gunakan Live Server,
> `php -S localhost:5500`, atau sejenisnya.

### Akun Demo
- **Email:** admin@elibrary.com
- **Password:** admin123

---

## 🔗 Link Demo & Video Presentasi

> ✏️ **fascinating-cuchufli-7cc9fd.netlify.app** Link demo

> ✏️ **(https://youtu.be/NKF5G8mWx2M?si=hw48DoZy_s-aUQFo)** Link video presentasi YouTube

---
