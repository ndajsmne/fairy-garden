# README - Dokumentasi Database Fairy Garden

Tujuan: Menyediakan panduan singkat untuk memahami dan memelihara struktur database aplikasi Fairy Garden (Florist).

Isi:
- `docs/database-structure.md` — penjelasan tabel, kolom, relasi, dan contoh query.
- `sql/schema.sql` — contoh skrip CREATE TABLE untuk migrasi awal.

Cara mengekspor schema dari MySQL:
1. Gunakan MySQL Workbench: `Server` -> `Data Export` -> pilih database -> Export to Self-Contained File.
2. Atau via CLI:

```sql
mysqldump -u root -p --no-data your_database > schema_dump.sql
```

Membuat ERD:
- MySQL Workbench: `Database` -> `Reverse Engineer...` lalu pilih schema.
- dbdiagram.io: tulis schema dengan sintaks DBML atau import SQL dump.
- Quick approach: gunakan `schema.sql` di folder `sql/` sebagai sumber kebenaran.

Cara memperbarui dokumentasi:
- Jika ada perubahan struktur, perbarui `sql/schema.sql` dan `docs/database-structure.md`.
- Commit perubahan dan jelaskan perubahan pada message commit (contoh: `docs(db): add coupon table and fields`).

Rekomendasi teknis:
- Gunakan migration tool (knex, sequelize-cli, flyway, liquibase) untuk mengelola perubahan schema.
- Simpan seed data untuk development di `sql/seeds/`.
- Pertimbangkan menambahkan `audits` table atau column (created_by, updated_by) bila diperlukan.

Kontak:
- Tim backend: backend@fairygarden.local (ganti dengan email tim)
