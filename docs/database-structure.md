# Dokumentasi Struktur Tabel - Fairy Garden (Florist)

Dokumentasi ini dibuat ulang berdasarkan definisi pada `sql/schema.sql` yang kamu kirim. Konten fokus pada tabel berikut:
- `users`
- `categories`
- `products`
- `carts`
- `cart_items`
- `orders`
- `order_items`
- `payments`

Setiap tabel memuat: kolom, tipe data, constraint (PK/FK), dan contoh query singkat.

---

## users
Deskripsi: Menyimpan akun pengguna (admin dan pelanggan).

Kolom:
- `user_id` INT PRIMARY KEY AUTO_INCREMENT
- `nama` VARCHAR(100) NOT NULL
- `email` VARCHAR(100) NOT NULL UNIQUE
- `password` VARCHAR(255) NOT NULL
- `role` ENUM('admin','pelanggan') DEFAULT 'pelanggan'
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

Catatan: simpan password hanya dalam bentuk hash; jangan simpan plaintext.

Contoh:
```sql
INSERT INTO users (nama, email, password) VALUES ('Nadia','nadia@example.com','<hash>');
SELECT user_id, nama, email FROM users WHERE email = 'nadia@example.com';
```

---

## categories
Deskripsi: Kategori produk untuk memudahkan filtrasi.

Kolom:
- `kategori_id` INT PRIMARY KEY AUTO_INCREMENT
- `nama_kategori` VARCHAR(100) NOT NULL

Contoh:
```sql
INSERT INTO categories (nama_kategori) VALUES ('Rangkaian Bunga');
SELECT * FROM categories;
```

---

## products
Deskripsi: Menyimpan informasi produk.

Kolom:
- `product_id` INT PRIMARY KEY AUTO_INCREMENT
- `nama` VARCHAR(100) NOT NULL
- `deskripsi` TEXT
- `harga` DECIMAL(10,2) NOT NULL
- `stok` INT DEFAULT 0
- `gambar` VARCHAR(255)
- `kategori_id` INT NULL -- FK -> categories(kategori_id)

Constraint:
- FOREIGN KEY (`kategori_id`) REFERENCES `categories`(`kategori_id`)

Contoh:
```sql
SELECT p.product_id, p.nama, p.harga, c.nama_kategori
FROM products p
LEFT JOIN categories c ON p.kategori_id = c.kategori_id
WHERE p.stok > 0;
```

---

## carts
Deskripsi: Keranjang belanja yang disimpan per pengguna (opsional).

Kolom:
- `cart_id` INT PRIMARY KEY AUTO_INCREMENT
- `user_id` INT NOT NULL -- FK -> users(user_id)
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

Constraint:
- FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)

Contoh:
```sql
INSERT INTO carts (user_id) VALUES (1);
SELECT * FROM carts WHERE user_id = 1;
```

---

## cart_items
Deskripsi: Item yang ada di dalam `carts`.

Kolom:
- `cart_item_id` INT PRIMARY KEY AUTO_INCREMENT
- `cart_id` INT NOT NULL -- FK -> carts(cart_id)
- `product_id` INT NOT NULL -- FK -> products(product_id)
- `jumlah` INT NOT NULL DEFAULT 1

Constraint:
- FOREIGN KEY (`cart_id`) REFERENCES `carts`(`cart_id`)
- FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`)

Contoh:
```sql
INSERT INTO cart_items (cart_id, product_id, jumlah) VALUES (1, 10, 2);
SELECT ci.*, p.nama, p.harga FROM cart_items ci JOIN products p ON ci.product_id = p.product_id WHERE ci.cart_id = 1;
```

---

## orders
Deskripsi: Metadata pesanan.

Kolom:
- `order_id` INT PRIMARY KEY AUTO_INCREMENT
- `user_id` INT NOT NULL -- FK -> users(user_id)
- `tanggal_pesan` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `total_harga` DECIMAL(12,2)
- `status` ENUM('pending','paid','processing','shipped','completed','cancelled') DEFAULT 'pending'

Constraint:
- FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)

Contoh:
```sql
INSERT INTO orders (user_id, total_harga) VALUES (1, 250000.00);
SELECT * FROM orders WHERE user_id = 1 ORDER BY tanggal_pesan DESC;
```

---

## order_items
Deskripsi: Item per pesanan; menyimpan snapshot harga saat pembelian.

Kolom:
- `order_item_id` INT PRIMARY KEY AUTO_INCREMENT
- `order_id` INT NOT NULL -- FK -> orders(order_id)
- `product_id` INT NOT NULL -- FK -> products(product_id)
- `jumlah` INT NOT NULL
- `harga_satuan` DECIMAL(10,2) NOT NULL

Constraint:
- FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`)
- FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`)

Contoh:
```sql
INSERT INTO order_items (order_id, product_id, jumlah, harga_satuan) VALUES (1, 10, 2, 125000.00);
SELECT oi.*, p.nama FROM order_items oi JOIN products p ON oi.product_id = p.product_id WHERE oi.order_id = 1;
-- Hitung total order dari order_items
SELECT SUM(jumlah * harga_satuan) as total FROM order_items WHERE order_id = 1;
```

---

## payments
Deskripsi: Catatan pembayaran terkait pesanan.

Kolom:
- `payment_id` INT PRIMARY KEY AUTO_INCREMENT
- `order_id` INT NOT NULL -- FK -> orders(order_id)
- `metode` VARCHAR(50)
- `status` ENUM('unpaid','paid','failed') DEFAULT 'unpaid'
- `tanggal_bayar` TIMESTAMP NULL
- `jumlah` DECIMAL(12,2)

Constraint:
- FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`)

Contoh:
```sql
INSERT INTO payments (order_id, metode, jumlah) VALUES (1, 'bank_transfer', 250000.00);
UPDATE payments SET status = 'paid', tanggal_bayar = NOW() WHERE payment_id = 1;
```

---

## Relasi Kunci Utama & Asumsi
- `users.user_id` (PK)
- `categories.kategori_id` (PK)
- `products.product_id` (PK) — `products.kategori_id` (FK)
- `carts.cart_id` (PK) — `carts.user_id` (FK)
- `cart_items.cart_item_id` (PK) — `cart_items.cart_id` (FK), `cart_items.product_id` (FK)
- `orders.order_id` (PK) — `orders.user_id` (FK)
- `order_items.order_item_id` (PK) — `order_items.order_id` (FK), `order_items.product_id` (FK)
- `payments.payment_id` (PK) — `payments.order_id` (FK)

Catatan implementasi dan rekomendasi:
- Pertimbangkan menambahkan `ON DELETE`/`ON UPDATE` behavior pada FK (mis. `ON DELETE CASCADE` untuk `order_items` ketika `orders` dihapus).
- Simpan snapshot harga (`harga_satuan`) di `order_items` agar histori transaksi tetap benar meskipun `products.harga` berubah.
- Gunakan transaksi saat membuat order: simpan `orders`, `order_items`, kurangi `products.stok`, dan buat `payments`.
- Simpan sensitive data (mis. payment tokens) dengan enkripsi atau di sistem pembayaran pihak ketiga.

---

Jika ingin, saya bisa juga:
- Menambahkan contoh migration scripts (MySQL ddl atau menggunakan knex/sequelize),
- Menambahkan seed data untuk pengembangan,
- Mengenerate ERD diagram (butuh SQL dump / MySQL Workbench / alat eksternal untuk grafik).

Silakan beri tahu perubahan atau tambahkan field yang kamu perlukan.
