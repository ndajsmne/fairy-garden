exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(table) {
      table.increments('user_id').primary();
      table.string('nama', 100).notNullable();
      table.string('email', 100).notNullable().unique();
      table.string('password', 255).notNullable();
      table.enu('role', ['admin','pelanggan']).defaultTo('pelanggan');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('categories', function(table) {
      table.increments('kategori_id').primary();
      table.string('nama_kategori', 100).notNullable();
    })
    .createTable('products', function(table) {
      table.increments('product_id').primary();
      table.string('nama', 100).notNullable();
      table.text('deskripsi');
      table.decimal('harga', 10, 2).notNullable();
      table.integer('stok').defaultTo(0);
      table.string('gambar', 255);
      table.integer('kategori_id').unsigned().nullable();
      table.foreign('kategori_id').references('categories.kategori_id');
    })
    .createTable('carts', function(table) {
      table.increments('cart_id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.foreign('user_id').references('users.user_id');
    })
    .createTable('cart_items', function(table) {
      table.increments('cart_item_id').primary();
      table.integer('cart_id').unsigned().notNullable();
      table.integer('product_id').unsigned().notNullable();
      table.integer('jumlah').defaultTo(1).notNullable();
      table.foreign('cart_id').references('carts.cart_id');
      table.foreign('product_id').references('products.product_id');
    })
    .createTable('orders', function(table) {
      table.increments('order_id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.timestamp('tanggal_pesan').defaultTo(knex.fn.now());
      table.decimal('total_harga', 12, 2);
      table.enu('status', ['pending','paid','processing','shipped','completed','cancelled']).defaultTo('pending');
      table.foreign('user_id').references('users.user_id');
    })
    .createTable('order_items', function(table) {
      table.increments('order_item_id').primary();
      table.integer('order_id').unsigned().notNullable();
      table.integer('product_id').unsigned().notNullable();
      table.integer('jumlah').notNullable();
      table.decimal('harga_satuan', 10, 2).notNullable();
      table.foreign('order_id').references('orders.order_id');
      table.foreign('product_id').references('products.product_id');
    })
    .createTable('payments', function(table) {
      table.increments('payment_id').primary();
      table.integer('order_id').unsigned().notNullable();
      table.string('metode', 50);
      table.enu('status', ['unpaid','paid','failed']).defaultTo('unpaid');
      table.timestamp('tanggal_bayar').nullable();
      table.decimal('jumlah', 12, 2);
      table.foreign('order_id').references('orders.order_id');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('payments')
    .dropTableIfExists('order_items')
    .dropTableIfExists('orders')
    .dropTableIfExists('cart_items')
    .dropTableIfExists('carts')
    .dropTableIfExists('products')
    .dropTableIfExists('categories')
    .dropTableIfExists('users');
};
