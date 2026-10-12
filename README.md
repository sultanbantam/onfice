# Onfice — Virtual Office

> **Your work, in one place.**  
> Kantor digital minimalis tempat orang, proyek, dokumen, komunikasi, agenda rapat, dan AI bekerja bersama dalam satu workspace terpadu.

---

## 🏛️ Gambaran Umum Arsitektur

Onfice dibangun di atas fondasi teknologi modern sesuai dengan panduan arsitektur pada `prompt.md`:

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19, TypeScript 5).
- **Styling & UI:** Tailwind CSS v4, Lucide Icons, Clean Minimalist Design System (Light & Dark theme ready).
- **Data Persistence:**
  - **Local File-Backed Database Engine** (`.data/onfice-store.json`) yang aktif secara default untuk menjamin seluruh data tugas, proyek, dokumen, rapat, dan kehadiran ruang virtual tersimpan secara persisten tanpa perlu konfigurasi rumit saat setup lokal.
  - **Supabase PostgreSQL & Row Level Security (RLS)** (`supabase/migrations/001_initial_schema.sql`): Skema database multi-tenant lengkap dengan proteksi isolasi antar organisasi, fungsi verifikasi membership, dan policy least privilege.
- **AI Assistant Copilot:** Server-side AI adapter (`src/lib/ai-adapter.ts`) yang terintegrasi dengan Google Gemini API (`GEMINI_API_KEY`) dan dilengkapi fallback *Contextual Workspace Reasoning Engine* dengan pola **Review & Confirm** sebelum mengeksekusi aksi penting ke sistem.

---

## 🚀 Fitur MVP yang Berfungsi End-to-End

1. **Home Overview (Beranda Utama):**
   - Menjawab 4 pertanyaan harian esensial: tugas hari ini, agenda rapat terdekat, status proyek aktif, serta tim & ruang virtual.
   - Aksi langsung: toggle status tugas, cepat masuk ruang rapat video call, dan shortcut ke AI Assistant.

2. **People & Team Directory:**
   - Direktori anggota dengan foto/avatar inisial, email, jabatan, dan tingkat akses (`owner`, `admin`, `member`, `guest`).
   - Indikator kehadiran langsung (*Online*, *Busy/Focus Mode*, *In Meeting*, *Away*, *Offline*).
   - Dialog undangan anggota baru dengan validasi format email dan penugasan peran.

3. **Projects & Task Management:**
   - Pemilihan proyek aktif dan progres kalkulasi otomatis berbasis tugas selesai.
   - Dual-view: **Kanban Board** 4 kolom (`To Do`, `In Progress`, `Blocked`, `Done`) dan **List View**.
   - Manajemen tugas lengkap: Judul, deskripsi, prioritas (`Urgent`, `High`, `Med`, `Low`), penanggung jawab, tenggat waktu, dan filter pencarian.
   - Tombol toggle status cepat dan modal edit/hapus yang langsung tersimpan ke backend.

4. **Office Rooms (2D Virtual Workspace):**
   - Representasi 2D ruang kerja digital: *Main Lobby*, *Deep Work & Focus Pod A*, *Boardroom / Rapat Strategis*, *Project Room: Core MVP*, dan *Executive Lounge*.
   - Aksi **Masuk Ruangan** (*Join Room*) dan **Keluar Ruang** (*Leave Room*) dengan sinkronisasi avatar anggota di dalam ruangan secara real-time.
   - Indikator ruang aktif di header navigasi atas.

5. **AI Assistant (Onfice Copilot):**
   - Entry point terpusat di sidebar dan header.
   - Memahami konteks workspace aktif (jumlah proyek, tugas tertunda, ruang yang terisi, agenda mendatang).
   - Mendukung instruksi pembuatan tugas otomatis, ringkasan progres sprint, dan status tim.
   - Menerapkan pola **Review & Confirm**: AI menyusun draf aksi dan menampilkan tombol konfirmasi sebelum tugas ditambahkan ke database.

6. **Documents & Knowledge Base:**
   - Arsip dokumen proyek dan panduan internal.
   - Metadata lengkap: ukuran file, tipe berkas, proyek terkait, dan pengunggah.
   - Filter dokumen per proyek dan modal pendaftaran berkas baru.

7. **Meetings & Agenda:**
   - Jadwal pertemuan tim dengan tanggal, jam mulai, dan jam selesai.
   - Tautan langsung ke ruang virtual kantor 2D dan tombol tautan panggilan video (*Jitsi / Google Meet*).
   - Modal penjadwalan rapat baru dan pembatalan rapat.

---

## 🛠️ Panduan Instalasi & Menjalankan Lokal

### 1. Prasyarat
- Node.js versi 18+ (disarankan Node.js 20 atau 24)
- npm versi 9+

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variable (Opsional)
Salin file `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```

Isi variabel opsional jika ingin mengaktifkan layanan eksternal:
- `GEMINI_API_KEY`: Kunci API Google Gemini untuk model generatif penuh.
- `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Untuk menghubungkan ke proyek Supabase di cloud.

*(Catatan: Aplikasi dapat langsung berjalan 100% tanpa mengisi file `.env.local` karena local persistence engine dan contextual AI heuristic sudah aktif secara bawaan).*

### 4. Menjalankan Server Development
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

### 5. Build Produksi & Type-Check
```bash
npm run build
```

---

## 🔒 Keamanan & Isolasi Tenant (Database Supabase RLS)

Skema database PostgreSQL dan migrasi RLS tersedia di:
```
supabase/migrations/001_initial_schema.sql
```
Skema ini mencakup tabel `organizations`, `profiles`, `organization_members`, `projects`, `project_members`, `tasks`, `rooms`, `documents`, `meetings`, dan `activity_logs`. Seluruh tabel telah dilengkapi dengan fungsi `is_org_member` dan policy Row Level Security (RLS) untuk mencegah kebocoran data antar-organisasi (IDOR protection).

---

## 📁 Struktur Folder Proyek

```
onfice/
├── .data/                           # Penyimpanan data persisten lokal (JSON file store)
├── public/                          # Static assets
├── src/
│   ├── app/
│   │   ├── api/                     # REST API routes (CRUD & server actions)
│   │   │   ├── ai/                  # AI copilot & execution route
│   │   │   ├── documents/           # Documents metadata API
│   │   │   ├── meetings/            # Agenda & meeting schedule API
│   │   │   ├── people/              # Team members & presence status API
│   │   │   ├── projects/            # Projects CRUD API
│   │   │   ├── rooms/               # 2D office room presence API
│   │   │   ├── tasks/               # Kanban tasks CRUD API
│   │   │   └── workspace/           # Workspace bootstrap API
│   │   ├── globals.css              # Global styling & Tailwind tokens
│   │   ├── layout.tsx               # Root layout & typography
│   │   └── page.tsx                 # OnficeApp shell utama
│   ├── components/
│   │   ├── ai/                      # AIAssistantChat component
│   │   ├── documents/               # DocumentsManager & UploadModal
│   │   ├── home/                    # HomeOverview dashboard
│   │   ├── layout/                  # AppSidebar & AppHeader
│   │   ├── meetings/                # MeetingsSchedule & ScheduleModal
│   │   ├── people/                  # PeopleDirectory & InviteMemberModal
│   │   ├── projects/                # ProjectsManager, ProjectModal, TaskModal
│   │   └── rooms/                   # OfficeRoomsView & RoomDetailModal
│   └── lib/
│       ├── ai-adapter.ts            # AI reasoning engine & Gemini adapter
│       ├── db.ts                    # File-based database store & seed data
│       └── types.ts                 # TypeScript domain models
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql   # PostgreSQL schema & RLS policies
├── .env.example                     # Template konfigurasi environment
├── prompt.md                        # Master prompt spesifikasi produk
└── package.json
```
