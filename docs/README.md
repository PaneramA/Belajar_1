# Metabase API Demo

Demo aplikasi web untuk mendemonstrasikan penggunaan Metabase API.

## 🚀 Cara Menjalankan

### Opsi 1: Double-click file batch (Termudah)
1. Double-click file `start-server.bat`
2. Browser akan otomatis terbuka di `http://localhost:8000`

### Opsi 2: Manual dengan Node.js
```bash
npx http-server -p 8000 -o
```

### Opsi 3: Manual dengan Python
```bash
python -m http.server 8000
```

Kemudian buka browser dan akses: `http://localhost:8000`

## 📋 Mode Demo

Karena aplikasi ini memerlukan instance Metabase yang aktif, tersedia **Demo Mode** untuk melihat tampilan interface:

1. Buka aplikasi di browser
2. Ketika login gagal, akan muncul prompt untuk masuk ke Demo Mode
3. Atau langsung akses: `http://localhost:8000?demo=true`

## 🔌 Koneksi ke Metabase Asli

Jika Anda memiliki instance Metabase yang berjalan:

1. Pastikan Metabase sudah running (misalnya di `http://localhost:3000`)
2. Masukkan URL Metabase, username, dan password
3. Klik "Connect to Metabase"

## 📁 File Structure

```
├── index.html              # Halaman utama
├── style.css              # Styling dengan dark theme
├── app.js                 # Logic aplikasi
├── metabase-api-example.js # Metabase API client
├── start-server.bat       # Script untuk start server
└── README.md             # File ini
```

## ✨ Fitur

- 🔐 Login ke Metabase instance
- 📊 Lihat daftar dashboards
- 📝 Lihat daftar questions/cards
- 🗄️ Lihat database yang terkoneksi
- 📋 API request logging
- 🎨 Modern dark theme UI
- 📱 Responsive design

## 🎨 Design Features

- Glassmorphism effects
- Smooth animations
- Gradient backgrounds
- Interactive hover effects
- Toast notifications
- Real-time API logging

## 🛠️ Teknologi

- HTML5
- CSS3 (Vanilla CSS dengan custom properties)
- JavaScript (ES6+)
- Metabase REST API

## 📝 Catatan

- Aplikasi ini adalah demo interface untuk Metabase API
- Untuk menggunakan fitur penuh, Anda perlu instance Metabase yang aktif
- Demo mode menampilkan data contoh untuk preview interface
