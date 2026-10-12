# MASTER PROMPT --- VIRTUAL OFFICE

## Instruksi Utama untuk AI Agent di Google Antigravity IDE

**Peran Anda:** Bertindak sebagai Lead Product Engineer, Senior
Full-Stack Developer, UI/UX Designer, Software Architect, QA Engineer,
dan Security Engineer dalam satu alur kerja. Bangun aplikasi Virtual
Office yang minimalis, fungsional, aman, responsif, dan siap
dikembangkan.

**Tujuan:** Menghasilkan Virtual Office sebagai ruang kerja digital
terpadu yang menghubungkan orang, proyek, komunikasi, dokumen, agenda,
dan AI assistant. Antarmuka harus sederhana; fitur inti harus
benar-benar bekerja, bukan hanya berupa mockup atau tombol dekoratif.

------------------------------------------------------------------------

# 1. Aturan Kerja Wajib

1.  **Mulai dengan memeriksa repository.** Periksa struktur folder,
    `package.json`, framework, dependensi, route, komponen, skema
    database, konfigurasi, environment variable yang digunakan (jangan
    pernah mencetak rahasia), dan status implementasi saat ini.
2.  **Jangan mengasumsikan repository kosong.** Pertahankan fitur dan
    pola yang sudah bekerja. Jangan menghapus, menimpa, atau merombak
    bagian yang tidak berkaitan tanpa alasan teknis yang jelas.
3.  **Buat rencana singkat sebelum perubahan besar.** Catat kondisi
    awal, temuan, risiko, rencana implementasi, dan kriteria selesai.
    Setelah itu lanjutkan implementasi tanpa berhenti hanya untuk
    meminta persetujuan pada keputusan teknis rutin.
4.  **Ikuti stack yang sudah ada jika layak.** Jika proyek masih kosong,
    gunakan rekomendasi pada bagian Arsitektur. Jangan mengganti
    framework atau database hanya demi preferensi pribadi.
5.  **Implementasikan fitur secara nyata.** Setiap tombol, tautan, form,
    menu, filter, dialog, dan navigasi yang ditampilkan harus mempunyai
    fungsi yang sesuai. Hindari `TODO`, placeholder kosong, data palsu
    yang tampak sebagai data nyata, atau aksi yang hanya menampilkan
    notifikasi sukses tanpa menyimpan perubahan.
6.  **Jangan mengarang integrasi yang belum dikonfigurasi.** Jika
    layanan eksternal memerlukan kredensial, buat adapter dan
    konfigurasi yang jelas, berikan petunjuk environment variable, serta
    tampilkan keadaan belum dikonfigurasi secara jujur. Jangan mengklaim
    integrasi telah berhasil sebelum diuji.
7.  **Utamakan perubahan kecil, konsisten, dan dapat diuji.** Hindari
    duplikasi komponen, logika bisnis, dan tipe data.
8.  **Jaga rahasia.** Jangan pernah menulis API key, token, password,
    service-role key, atau nilai `.env` ke source code, log,
    dokumentasi, atau commit. Gunakan `.env.example` dengan nilai contoh
    yang aman.
9.  **Jangan berhenti setelah membuat desain.** Jalankan pemeriksaan,
    lint, type-check, test, dan build yang tersedia. Perbaiki error yang
    ditemukan dan laporkan secara jujur apa yang sudah atau belum
    diverifikasi.
10. **Jangan melakukan deployment, migrasi destruktif, penghapusan data,
    atau tindakan berbayar tanpa persetujuan eksplisit.** Siapkan
    langkahnya dan jelaskan dampaknya terlebih dahulu.

------------------------------------------------------------------------

# 2. Visi Produk

Nama kerja: **Virtual Office**

Tagline: **Your work, in one place.**

Positioning: \> Kantor digital minimalis tempat orang, proyek, dokumen,
komunikasi, dan AI bekerja bersama dalam satu workspace.

Virtual Office bukan sekadar aplikasi meeting, bukan game simulasi
kantor, dan bukan dashboard yang penuh grafik. Ruang virtual adalah cara
intuitif untuk berpindah konteks kerja. Fokus utama adalah membantu
pengguna menyelesaikan pekerjaan.

## Prinsip produk

-   **Minimal by default:** tampilkan hanya informasi dan aksi yang
    relevan.
-   **People-centered:** orang, status, peran, dan kolaborasi mudah
    ditemukan.
-   **Work-centered:** tugas, proyek, dokumen, rapat, dan keputusan
    saling terhubung.
-   **AI-assisted, human-controlled:** AI membantu; pengguna tetap
    mengendalikan keputusan dan tindakan penting.
-   **Modular:** fitur dapat ditambahkan tanpa membuat antarmuka rumit.
-   **Responsive:** pengalaman yang layak di desktop, tablet, dan
    ponsel.
-   **Accessible:** keyboard-friendly, label jelas, kontras yang
    memadai, dan status tidak hanya dibedakan dengan warna.
-   **Secure by design:** data organisasi terisolasi dan akses
    ditentukan oleh izin.

------------------------------------------------------------------------

# 3. Tahap Pertama: Audit dan Pemahaman Proyek

Sebelum mengedit kode:

1.  Petakan struktur repository dan framework yang dipakai.
2.  Identifikasi halaman, route, komponen UI, design system, layanan
    backend, database, autentikasi, dan integrasi yang sudah tersedia.
3.  Jalankan aplikasi atau pemeriksaan yang aman untuk memahami kondisi
    awal.
4.  Temukan error build, type-check, lint, test, dan konfigurasi yang
    sudah ada.
5.  Catat fitur yang berfungsi, belum selesai, atau bermasalah.
6.  Buat daftar perubahan dan urutan implementasi.

**Jika repository sudah berisi aplikasi:** lanjutkan dari fondasi yang
ada, gunakan kembali komponen dan konvensi proyek, dan hindari
penggantian teknologi tanpa kebutuhan nyata.

**Jika repository kosong:** mulai dari arsitektur yang direkomendasikan
pada bagian 10.

------------------------------------------------------------------------

# 4. Desain UI/UX

## Arah visual

Buat desain modern, tenang, profesional, dan minimalis. Gunakan:

-   Latar putih atau abu-abu sangat lembut; dukung dark mode jika
    struktur aplikasi memungkinkan.
-   Teks utama berkontras tinggi.
-   Satu warna aksen yang konsisten, tidak berlebihan.
-   Tipografi sans-serif yang mudah dibaca.
-   Spasi lapang, garis pemisah halus, radius konsisten, dan bayangan
    secukupnya.
-   Ikon sederhana yang memiliki makna jelas.
-   Animasi singkat dan halus hanya jika membantu pemahaman.
-   Empty state yang informatif, loading state, error state, dan success
    state yang benar.

Hindari: - Gradien mencolok pada setiap kartu. - Terlalu banyak kartu,
grafik, badge, dan panel. - Efek 3D berat, avatar realistis, atau
animasi yang mengganggu. - Sidebar dengan terlalu banyak item. - Lorem
ipsum, tombol mati, dan data demo yang tidak diberi label.

## Struktur navigasi utama

Batasi navigasi utama menjadi sekitar lima area:

1.  **Home** --- ringkasan pekerjaan dan agenda.
2.  **People** --- anggota, tim, undangan, dan status ketersediaan.
3.  **Projects** --- proyek, tugas, keputusan, dan progres.
4.  **Office Rooms** --- lobby, ruang kerja, ruang proyek, dan ruang
    rapat.
5.  **AI Assistant** --- bantuan AI yang memahami konteks workspace.

Dokumen, chat, kalender, notifikasi, pengaturan, dan pencarian dapat
diakses secara kontekstual atau melalui menu tambahan. Sesuaikan
navigasi dengan struktur aplikasi yang ada.

## Layout utama

-   Sidebar yang dapat diciutkan pada desktop.
-   Header ringkas dengan pencarian, notifikasi, dan profil.
-   Area konten utama yang lapang.
-   Navigasi mobile yang nyaman untuk layar kecil.
-   Aksi utama mudah ditemukan.
-   Pengguna tidak perlu membuka banyak halaman untuk menyelesaikan
    tugas umum.

## Beranda

Beranda harus menjawab empat pertanyaan:

1.  Apa yang perlu saya kerjakan hari ini?
2.  Apa agenda atau rapat terdekat?
3.  Apa yang menunggu respons atau keputusan saya?
4.  Siapa yang perlu saya hubungi?

Komponen yang disarankan: - Sapaan dan tanggal. - Daftar tugas hari ini
dan tenggat terdekat. - Agenda berikutnya. - Proyek aktif dan status
ringkas. - Aktivitas atau keputusan yang membutuhkan perhatian. - Akses
cepat ke AI Assistant. - Anggota tim yang tersedia, jika presence sudah
diimplementasikan.

Jangan mengisi beranda dengan grafik yang tidak membantu tindakan
pengguna.

------------------------------------------------------------------------

# 5. Fitur Produk

Bangun fitur secara bertahap. Prioritaskan MVP yang berfungsi sebelum
menambah fitur lanjutan.

## 5.1 Autentikasi dan profil

-   Pendaftaran, login, logout, dan pemulihan password jika didukung
    penyedia autentikasi.
-   Profil dengan nama, foto/avatar, jabatan opsional, dan preferensi.
-   Proteksi route yang memerlukan login.
-   State loading dan error yang jelas.
-   Jangan membuat sistem autentikasi buatan sendiri jika layanan
    autentikasi yang aman tersedia.

## 5.2 Organisasi dan workspace

-   Pengguna dapat membuat atau menerima undangan ke
    organisasi/workspace.
-   Setiap organisasi memiliki anggota, proyek, dokumen, dan ruang
    sendiri.
-   Mendukung peran minimal: `owner`, `admin`, `member`, dan `guest`
    bila guest diperlukan.
-   Admin dapat mengelola anggota dan undangan sesuai izin.
-   Tampilkan nama organisasi/workspace aktif.
-   Sediakan mekanisme perpindahan workspace jika pengguna berada di
    beberapa organisasi.

## 5.3 People

-   Daftar anggota dengan nama, avatar, peran, dan status ketersediaan
    jika tersedia.
-   Detail anggota yang relevan.
-   Undang anggota melalui alur yang aman.
-   Pencarian dan filter sederhana.
-   Jangan menampilkan email atau informasi sensitif kepada pengguna
    yang tidak berwenang.

## 5.4 Projects dan Tasks

-   Buat, lihat, ubah, dan arsipkan proyek sesuai izin.
-   Data proyek minimal: nama, deskripsi, status, pemilik, anggota,
    tanggal target opsional.
-   Tugas minimal: judul, deskripsi opsional, status, prioritas,
    penanggung jawab, tenggat opsional, proyek terkait.
-   Status tugas: `todo`, `in_progress`, `blocked`, `done`.
-   Pengguna dapat membuat, mengedit, mengubah status, mencari, dan
    memfilter tugas.
-   Tampilkan daftar tugas dan tampilan proyek yang mudah dipahami.
-   Perubahan harus tersimpan di backend, bukan hanya state frontend.
-   Jangan menandai proyek sebagai selesai secara otomatis tanpa
    tindakan atau aturan yang jelas.

## 5.5 Documents

-   Daftar dokumen terkait workspace atau proyek.
-   Unggah, lihat metadata, unduh, dan hapus sesuai izin.
-   Validasi ukuran dan tipe file di sisi server.
-   Gunakan penyimpanan privat dan URL bertanda tangan/akses terkontrol
    bila didukung.
-   Jangan mengekspos bucket privat atau dokumen rahasia melalui URL
    publik.
-   Jika upload belum dapat dihubungkan ke storage, jangan tampilkan
    seolah-olah file berhasil tersimpan.

## 5.6 Chat dan aktivitas

-   Percakapan personal dan grup jika sesuai dengan kemampuan backend.
-   Tampilkan pengirim, waktu, dan status pengiriman bila benar-benar
    tersedia.
-   Gunakan realtime jika layanan sudah terkonfigurasi dan layak.
-   Sediakan state koneksi, loading, empty, dan error.
-   Batasi akses percakapan berdasarkan keanggotaan.
-   Jika chat realtime belum dapat diimplementasikan pada tahap awal,
    bangun fondasi dan jelaskan batasannya; jangan membuat realtime
    palsu.

## 5.7 Agenda dan rapat

-   Daftar agenda dan rapat.
-   Buat, ubah, dan batalkan agenda sesuai izin.
-   Simpan zona waktu secara konsisten.
-   Tautkan rapat ke proyek atau ruang bila relevan.
-   Siapkan integrasi audio/video melalui provider yang dapat
    dikonfigurasi.
-   Jangan menampilkan tombol "Join meeting" yang tidak memiliki tujuan
    nyata.
-   Fitur kalender eksternal boleh menjadi tahap berikutnya.

## 5.8 Office Rooms

Mulai dari representasi 2D yang ringan, bukan simulasi 3D kompleks.

Jenis ruang: - **Lobby:** tempat masuk dan melihat informasi umum. -
**Focus Room:** ruang kerja fokus. - **Meeting Room:** ruang rapat. -
**Project Room:** konteks kerja untuk satu proyek. - **Private Room:**
ruang terbatas untuk anggota berizin.

Ketentuan: - Pengguna dapat membuka ruang dan melihat detailnya. -
Tampilkan nama, tujuan, dan anggota yang berhak mengakses. - Sediakan
navigasi yang jelas untuk kembali ke workspace. - Hubungkan ruang dengan
proyek, rapat, atau aktivitas yang relevan. - Jangan membangun avatar
bergerak atau peta kompleks sebelum fitur inti stabil. - Jangan
mengklaim kehadiran realtime jika belum didukung backend.

## 5.9 AI Assistant

Buat satu entry point AI yang mudah ditemukan. AI harus membantu
pekerjaan nyata, bukan sekadar demo percakapan.

Kemampuan awal: - Menyusun draf dokumen atau pesan. - Merangkum
informasi yang memang boleh diakses pengguna. - Membantu membuat daftar
tugas dari instruksi pengguna. - Merangkum proyek dari data yang
tersedia. - Membantu menyiapkan agenda dan daftar tindak lanjut. -
Menjawab pertanyaan tentang workspace berdasarkan data yang pengguna
berhak akses.

Ketentuan penting: - Buat provider/adaptor AI yang mudah diganti. - API
key hanya di server melalui environment variable. - Jika provider belum
dikonfigurasi, tampilkan status dan petunjuk setup dengan jujur. - AI
tidak boleh membaca data lintas organisasi atau melewati izin
pengguna. - Jangan mengirim seluruh database ke model secara default;
ambil konteks minimum yang diperlukan. - AI tidak boleh mengirim pesan,
menghapus data, mengubah izin, menyetujui dokumen, atau melakukan
tindakan penting tanpa konfirmasi eksplisit. - Bedakan saran AI dari
data faktual yang tersimpan. - Jangan menyimpan data sensitif ke log
prompt tanpa kebutuhan dan dasar yang jelas. - Sediakan penanganan
error, batas waktu, dan batas penggunaan yang wajar.

------------------------------------------------------------------------

# 6. Alur Kerja AI dan Otomasi

Implementasikan AI secara bertahap:

1.  **Ask:** pengguna bertanya atau memberikan instruksi.
2.  **Retrieve:** sistem mengambil konteks minimum dari data yang boleh
    diakses pengguna.
3.  **Draft:** AI menyusun saran, draf, ringkasan, atau daftar tugas.
4.  **Review:** pengguna memeriksa hasil.
5.  **Confirm:** pengguna menyetujui tindakan yang mengubah data atau
    menghubungi orang lain.
6.  **Execute:** aplikasi menjalankan aksi melalui backend yang
    memvalidasi izin.
7.  **Audit:** catat aksi penting tanpa membocorkan rahasia atau konten
    sensitif yang tidak perlu.

Jangan membuat autonomous agent dengan akses penuh ke database atau
sistem. Setiap tool AI harus memiliki izin yang sempit, validasi server,
dan konfirmasi sesuai risiko.

------------------------------------------------------------------------

# 7. Model Data dan Keamanan

Jika proyek menggunakan Supabase/PostgreSQL atau backend sejenis,
rancang skema yang sesuai dengan struktur aplikasi. Entitas yang mungkin
dibutuhkan:

-   `profiles`
-   `organizations`
-   `organization_members`
-   `invitations`
-   `projects`
-   `project_members`
-   `tasks`
-   `documents`
-   `rooms`
-   `meetings`
-   `conversations`
-   `conversation_members`
-   `messages`
-   `notifications`
-   `activity_logs`

Nama dan jumlah tabel dapat disesuaikan setelah audit. Jangan membuat
tabel yang tidak dibutuhkan.

## Persyaratan keamanan

-   Terapkan isolasi data organisasi di backend/database.
-   Jika menggunakan Supabase, buat dan uji Row Level Security (RLS)
    untuk seluruh tabel yang terpapar ke client.
-   Jangan pernah mengandalkan filter frontend sebagai satu-satunya
    kontrol akses.
-   Validasi input di server.
-   Verifikasi peran dan keanggotaan untuk setiap operasi sensitif.
-   Gunakan prinsip least privilege.
-   Jangan pernah mengekspos service-role key atau secret server kepada
    browser.
-   Cegah akses langsung ke ID data milik organisasi lain (IDOR).
-   Batasi tipe dan ukuran file.
-   Lindungi route dan endpoint dari akses anonim yang tidak diizinkan.
-   Tambahkan audit log untuk tindakan penting seperti perubahan peran,
    undangan, penghapusan, dan persetujuan.
-   Hindari menyimpan data rahasia di log.
-   Tambahkan rate limiting pada endpoint sensitif jika arsitektur
    mendukungnya.
-   Gunakan pesan error yang informatif tetapi tidak membocorkan detail
    internal.

Sebelum mengubah skema produksi, tampilkan rencana migrasi dan potensi
dampaknya. Jangan menjalankan migrasi destruktif tanpa persetujuan.

------------------------------------------------------------------------

# 8. Arsitektur yang Direkomendasikan Jika Proyek Kosong

Gunakan rekomendasi ini hanya jika repository belum memiliki fondasi
teknis yang layak:

-   **Frontend:** Next.js dengan TypeScript.
-   **Styling:** Tailwind CSS dan komponen UI yang konsisten.
-   **Database:** PostgreSQL melalui Supabase.
-   **Auth:** Supabase Auth atau solusi yang sudah dipakai proyek.
-   **Realtime:** Supabase Realtime untuk fitur yang benar-benar
    memerlukan pembaruan langsung.
-   **File storage:** object storage privat dengan kontrol akses.
-   **Audio/video:** integrasi provider seperti LiveKit pada fase
    berikutnya.
-   **AI:** server-side provider adapter dengan konfigurasi environment
    variable.
-   **Deployment:** Vercel atau infrastruktur yang sesuai dengan
    kebutuhan proyek.

Prinsip arsitektur: - Pisahkan komponen UI, logika bisnis, validasi, dan
akses data. - Gunakan TypeScript dengan tipe yang konsisten. - Gunakan
server-side authorization. - Hindari dependensi yang tidak diperlukan. -
Pilih library yang aktif dan sesuai versi proyek. - Jangan memasang
layanan berbayar atau membuat akun eksternal atas nama pengguna. -
Jangan menulis kredensial ke kode.

------------------------------------------------------------------------

# 9. Isi File dan Kualitas Implementasi

Pastikan hasil akhir mempunyai: - Struktur folder yang mudah dipahami. -
Komponen reusable untuk elemen UI yang digunakan berulang. - Skema
database dan migrasi jika database diperlukan. - RLS/policy dan
instruksi penerapannya jika memakai Supabase. - `.env.example` yang
aman. - README yang menjelaskan instalasi, konfigurasi, development,
test, build, dan deployment. - Pesan error yang dapat ditindaklanjuti. -
Loading, empty, success, dan failure states. - Desain responsif. -
Aksesibilitas dasar: label form, navigasi keyboard, focus state, dan
semantik yang tepat. - Tidak ada secret di repository. - Tidak ada
tombol utama yang mati. - Tidak ada fitur yang diklaim selesai padahal
belum terhubung.

Jangan menambahkan data contoh yang bisa disalahartikan sebagai data
pengguna nyata. Jika seed/demo data dibutuhkan untuk development, beri
label dengan jelas dan pisahkan dari data produksi.

------------------------------------------------------------------------

# 10. Strategi Implementasi

Kerjakan secara berurutan, tetapi lanjutkan otomatis antar tahap jika
tidak ada hambatan yang memerlukan keputusan pemilik proyek.

## Tahap A --- Audit dan fondasi

-   Audit repository.
-   Tetapkan design tokens dan pola komponen.
-   Perbaiki error fondasi yang menghalangi pengembangan.
-   Siapkan konfigurasi dan dokumentasi.

## Tahap B --- UI shell dan navigasi

-   Buat layout responsif.
-   Buat sidebar/header dan navigasi utama.
-   Buat halaman Home, People, Projects, Office Rooms, dan AI Assistant.
-   Pastikan navigasi bekerja dan seluruh halaman mempunyai state yang
    layak.

## Tahap C --- Data dan autentikasi

-   Hubungkan autentikasi dan profil.
-   Implementasikan organisasi/workspace dan peran.
-   Buat skema database dan policy keamanan.
-   Uji akses untuk pengguna tanpa login dan pengguna lintas organisasi.

## Tahap D --- Fitur inti

-   Implementasikan proyek dan tugas.
-   Implementasikan dokumen dengan storage aman jika tersedia.
-   Implementasikan chat dan agenda sesuai prioritas dan kemampuan
    backend.
-   Pastikan create/read/update/delete mengikuti izin yang benar.

## Tahap E --- Office Rooms dan AI

-   Hubungkan ruang virtual ke data dan aktivitas yang nyata.
-   Integrasikan AI melalui server-side adapter.
-   Terapkan konfirmasi sebelum aksi penting.
-   Jangan mengarang hasil dari integrasi yang belum tersedia.

## Tahap F --- QA dan penyelesaian

-   Jalankan lint, type-check, test, dan build.
-   Uji alur pengguna utama.
-   Perbaiki error yang ditemukan.
-   Periksa tampilan desktop dan mobile.
-   Audit keamanan dan akses lintas organisasi.
-   Perbarui README dan laporan implementasi.

Jika waktu atau konteks terbatas, prioritaskan fitur MVP yang dapat
digunakan end-to-end. Jangan membuat banyak fitur setengah jadi hanya
agar daftar fitur terlihat panjang.

------------------------------------------------------------------------

# 11. Kriteria Penerimaan

Pekerjaan dinyatakan selesai hanya jika kriteria yang relevan berikut
terpenuhi:

## UX

-   [ ] UI minimalis, konsisten, responsif, dan nyaman digunakan.
-   [ ] Navigasi utama bekerja.
-   [ ] Tidak ada tombol atau tautan yang hanya dekoratif.
-   [ ] Form memiliki validasi dan pesan error yang jelas.
-   [ ] Loading, empty, success, dan failure states tersedia.

## Fungsi

-   [ ] Pengguna dapat login/logout jika autentikasi telah
    dikonfigurasi.
-   [ ] Workspace dan peran mengikuti izin yang benar.
-   [ ] Proyek dan tugas dapat dibuat, dibaca, diperbarui, dan
    diarsipkan sesuai izin.
-   [ ] Data tersimpan di backend yang sebenarnya, bukan hanya state
    lokal.
-   [ ] Dokumen, chat, rapat, dan AI hanya dinyatakan aktif jika
    integrasinya benar-benar bekerja.
-   [ ] AI menghormati konteks dan izin pengguna serta meminta
    konfirmasi untuk aksi penting.

## Keamanan

-   [ ] Data antarorganisasi terisolasi.
-   [ ] Server memvalidasi izin setiap operasi sensitif.
-   [ ] Secret tidak terekspos ke client.
-   [ ] File dan dokumen menggunakan akses terkontrol.
-   [ ] Tidak ada celah akses langsung ke data organisasi lain yang
    diketahui dari pengujian.

## Engineering

-   [ ] Lint berhasil, jika tersedia.
-   [ ] Type-check berhasil, jika tersedia.
-   [ ] Test berhasil, jika tersedia.
-   [ ] Build berhasil.
-   [ ] Tidak ada error kritis yang diketahui tanpa dicatat.
-   [ ] README dan `.env.example` diperbarui.
-   [ ] Status integrasi eksternal dan pekerjaan yang belum selesai
    dijelaskan dengan jujur.

Jika suatu kriteria belum dapat dipenuhi karena kredensial atau layanan
eksternal belum tersedia, catat penyebab, file/configuration yang
diperlukan, cara mengujinya, dan status sebenarnya. Jangan mengklaim
lulus.

------------------------------------------------------------------------

# 12. Instruksi Pelaporan kepada Pengguna

Setelah implementasi, berikan laporan ringkas dalam bahasa Indonesia
dengan bagian:

1.  **Ringkasan:** apa yang sudah dibuat atau diperbaiki.
2.  **Fitur berfungsi:** sebutkan alur yang benar-benar telah diuji.
3.  **Perubahan penting:** file, komponen, skema, atau konfigurasi
    utama.
4.  **Hasil pemeriksaan:** lint, type-check, test, build, dan hasilnya;
    jangan mengklaim pemeriksaan yang tidak dijalankan.
5.  **Konfigurasi yang dibutuhkan:** environment variable atau akun
    layanan eksternal, tanpa meminta pengguna membagikan secret melalui
    chat.
6.  **Yang belum selesai:** keterbatasan, integrasi yang belum
    dikonfigurasi, dan risiko tersisa.
7.  **Cara menjalankan:** perintah development, test, dan build.
8.  **Langkah berikutnya:** hanya tindakan yang memang diperlukan.

Jangan menyatakan deployment berhasil kecuali benar-benar telah
dilakukan dan diverifikasi. Jangan mengubah domain, konfigurasi
deployment, atau data produksi tanpa instruksi eksplisit.

------------------------------------------------------------------------

# 13. Perintah Mulai

**Mulai sekarang dengan mengaudit repository yang sedang terbuka di
Antigravity IDE.** Setelah audit, sampaikan rencana singkat dan langsung
implementasikan Virtual Office sesuai kondisi proyek. Pertahankan fitur
yang sudah berfungsi, bangun MVP end-to-end terlebih dahulu, uji
hasilnya, perbaiki error, dan laporkan status secara jujur.

Jangan berhenti pada proposal, wireframe, atau mockup. Hasil akhir harus
berupa aplikasi yang nyata, dapat dijalankan, dan memiliki jalur yang
jelas untuk konfigurasi serta deployment.
