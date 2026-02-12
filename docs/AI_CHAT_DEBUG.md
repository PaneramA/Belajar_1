# Test AI Chat - Debug Instructions

## 🔍 Cara Debug AI Chat

### 1. Buka Browser Console
1. Tekan **F12** atau **Ctrl+Shift+I**
2. Klik tab **Console**
3. Refresh halaman (F5)

### 2. Test Chat
1. Login ke dashboard
2. Klik tombol chat 💬
3. Jika diminta API key, masukkan: `AIzaSyC0TMeiL7dCUO179v2g05ZYVnlEdots_MY`
4. Ketik pertanyaan: "Berapa revenue saya saat ini?"
5. Klik Send

### 3. Lihat Console Log
Anda akan melihat log seperti ini:

```
=== sendMessage called ===
User message: Berapa revenue saya saat ini?
API Provider: gemini
Has API Key: true
User message saved
Calling AI API...
sendToGemini called with message: Berapa revenue saya saat ini?
API URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=HIDDEN
Sending request to Gemini API...
Response status: 200
API Response: {...}
AI Response received: [AI response text]
AI message saved
```

### 4. Jika Ada Error

**Error: "API key tidak valid"**
- Cek API key sudah benar
- Generate API key baru di: https://aistudio.google.com/app/apikey

**Error: "CORS error"**
- Ini normal untuk local development
- Solusi: Gunakan server (sudah ada di `server.js`)

**Error: "Network error"**
- Cek koneksi internet
- Cek firewall tidak block Google API

**Error: "Response status: 400"**
- API key salah atau expired
- Generate API key baru

**Error: "Response status: 429"**
- Quota habis (15 req/menit)
- Tunggu 1 menit, coba lagi

### 5. Manual Test API

Buka console dan jalankan:

```javascript
// Test API key
console.log('API Key:', chatAssistant.apiKey);

// Test send message
chatAssistant.sendMessage('Halo!').then(response => {
    console.log('Success:', response);
}).catch(error => {
    console.error('Error:', error);
});
```

### 6. Clear Chat & Reset

Jika chat bermasalah:

```javascript
// Clear chat history
chatAssistant.clearHistory();

// Clear API key
localStorage.removeItem('ai_api_key');

// Reload page
location.reload();
```

## ✅ Expected Behavior

1. User mengetik pesan
2. Pesan user muncul di chat
3. Typing indicator muncul (3 dots)
4. Setelah 2-5 detik, AI response muncul
5. Chat history tersimpan

## 🐛 Common Issues

### Issue: AI tidak merespon sama sekali
**Solution:**
1. Cek console untuk error
2. Cek API key sudah tersimpan: `localStorage.getItem('ai_api_key')`
3. Test manual dengan code di atas

### Issue: Typing indicator muncul tapi tidak ada response
**Solution:**
1. Lihat error di console
2. Kemungkinan API key invalid atau quota habis
3. Coba API key baru

### Issue: Response sangat lambat
**Solution:**
- Normal, Gemini API bisa 2-10 detik
- Jika lebih dari 30 detik, ada masalah network

## 📝 Notes

- API key user: `AIzaSyC0TMeiL7dCUO179v2g05ZYVnlEdots_MY`
- Free tier: 15 requests/minute
- Model: gemini-1.5-flash
- Max tokens: 500

Jika masih error, screenshot console log dan kirim ke developer!
