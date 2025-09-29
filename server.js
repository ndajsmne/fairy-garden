const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Route dasar
app.get('/', (req, res) => {
  res.send('🌸 Fairy Garden API is running! 🌸');
});

// Contoh rute tambahan nanti: /produk, /user, dll
// const produkRoutes = require('./routes/produk');
// app.use('/produk', produkRoutes);

app.listen(PORT, () => {
  console.log(`✅ Fairy Garden server berjalan di http://localhost:${PORT}`);
});
