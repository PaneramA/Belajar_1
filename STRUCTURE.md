# 📁 Struktur Folder Metabase API Demo

```
Metabase-API-Demo/
│
├── 📄 index.html              # Halaman utama aplikasi
├── 📊 business-overview.html  # Dashboard Business Overview
├── 🚀 server.js               # Node.js server untuk menjalankan aplikasi
├── ▶️  start.bat              # Script untuk menjalankan server (double-click)
├── 📋 start-server.bat        # Alternative server script
│
├── 📁 css/                    # Folder untuk semua file CSS
│   ├── style.css             # Styling utama dengan dark theme
│   └── business-overview.css # Styling untuk Business Overview
│
├── 📁 js/                     # Folder untuk semua file JavaScript
│   ├── metabase-api.js       # Metabase API client class
│   ├── app.js                # Logic aplikasi utama
│   └── business-overview.js  # Charts untuk Business Overview
│
└── 📁 docs/                   # Folder untuk dokumentasi
    └── README.md             # Dokumentasi lengkap cara penggunaan
```

## 🎯 Penjelasan File

### Root Files
- **index.html** - Halaman utama dengan UI login dan dashboard
- **server.js** - Simple HTTP server menggunakan Node.js
- **start.bat** - Script termudah untuk menjalankan aplikasi (double-click saja!)
- **start-server.bat** - Alternative script dengan fallback options

### CSS Folder
- **style.css** - Semua styling untuk aplikasi:
  - Dark theme dengan gradient
  - Glassmorphism effects
  - Responsive design
  - Animations dan transitions

### JS Folder
- **metabase-api.js** - Class untuk berinteraksi dengan Metabase API:
  - Login/Logout
  - Get dashboards, questions, databases
  - Run queries
  - Error handling
  
- **app.js** - Logic aplikasi:
  - Handle login form
  - Tab switching
  - Data loading
  - Toast notifications
  - Demo mode

### Docs Folder
- **README.md** - Dokumentasi lengkap:
  - Cara instalasi
  - Cara menjalankan
  - Penjelasan fitur
  - Tips penggunaan

## 🚀 Cara Menjalankan

1. **Double-click** file `start.bat`
2. Browser akan otomatis terbuka
3. Gunakan demo mode dengan URL: `http://localhost:8000?demo=true`

## 📝 Catatan

Struktur folder ini dibuat agar:
- ✅ Lebih mudah mencari file
- ✅ Kode lebih terorganisir
- ✅ Maintenance lebih mudah
- ✅ Mengikuti best practices web development
