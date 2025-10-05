-- Tabel Users
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'pelanggan') DEFAULT 'pelanggan',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Categories
CREATE TABLE categories (
  kategori_id INT PRIMARY KEY AUTO_INCREMENT,
  nama_kategori VARCHAR(100) NOT NULL
);

-- Tabel Products
CREATE TABLE products (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  harga DECIMAL(10,2) NOT NULL,
  stok INT DEFAULT 0,
  gambar VARCHAR(255),
  kategori_id INT,
  FOREIGN KEY (kategori_id) REFERENCES categories(kategori_id)
);

-- Tabel Carts
CREATE TABLE carts (
  cart_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Tabel Cart_Items
CREATE TABLE cart_items (
  cart_item_id INT PRIMARY KEY AUTO_INCREMENT,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  jumlah INT NOT NULL DEFAULT 1,
  FOREIGN KEY (cart_id) REFERENCES carts(cart_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Tabel Orders
CREATE TABLE orders (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  tanggal_pesan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_harga DECIMAL(12,2),
  status ENUM('pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled') DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Tabel Order_Items
CREATE TABLE order_items (
  order_item_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  jumlah INT NOT NULL,
  harga_satuan DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Tabel Payments
CREATE TABLE payments (
  payment_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  metode VARCHAR(50),
  status ENUM('unpaid', 'paid', 'failed') DEFAULT 'unpaid',
  tanggal_bayar TIMESTAMP NULL,
  jumlah DECIMAL(12,2),
  FOREIGN KEY (order_id) REFERENCES orders(order_id)
);