/**
 * Contoh Penggunaan Metabase API
 * 
 * CATATAN PENTING:
 * - Ganti 'http://localhost:3000' dengan URL instance Metabase Anda
 * - Ganti username dan password dengan kredensial Anda
 */

class MetabaseAPI {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.sessionToken = null;
  }

  /**
   * Login dan dapatkan session token
   */
  async login(username, password) {
    try {
      const response = await fetch(`${this.baseUrl}/api/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.sessionToken = data.id;
      console.log('✅ Login berhasil!');
      return this.sessionToken;
    } catch (error) {
      console.error('❌ Login gagal:', error.message);
      throw error;
    }
  }

  /**
   * Helper method untuk membuat request dengan autentikasi
   */
  async request(endpoint, options = {}) {
    if (!this.sessionToken) {
      throw new Error('Belum login! Panggil login() terlebih dahulu.');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'X-Metabase-Session': this.sessionToken,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Dapatkan semua dashboard
   */
  async getDashboards() {
    try {
      const dashboards = await this.request('/api/dashboard');
      console.log(`📊 Ditemukan ${dashboards.length} dashboard`);
      return dashboards;
    } catch (error) {
      console.error('❌ Gagal mengambil dashboard:', error.message);
      throw error;
    }
  }

  /**
   * Dapatkan detail dashboard berdasarkan ID
   */
  async getDashboard(dashboardId) {
    try {
      const dashboard = await this.request(`/api/dashboard/${dashboardId}`);
      console.log(`📊 Dashboard: ${dashboard.name}`);
      return dashboard;
    } catch (error) {
      console.error('❌ Gagal mengambil dashboard:', error.message);
      throw error;
    }
  }

  /**
   * Dapatkan semua questions/cards
   */
  async getCards() {
    try {
      const cards = await this.request('/api/card');
      console.log(`📝 Ditemukan ${cards.length} cards`);
      return cards;
    } catch (error) {
      console.error('❌ Gagal mengambil cards:', error.message);
      throw error;
    }
  }

  /**
   * Jalankan query dari card
   */
  async runCardQuery(cardId) {
    try {
      const results = await this.request(`/api/card/${cardId}/query`, {
        method: 'POST'
      });
      console.log(`✅ Query berhasil dijalankan untuk card ${cardId}`);
      return results;
    } catch (error) {
      console.error('❌ Gagal menjalankan query:', error.message);
      throw error;
    }
  }

  /**
   * Dapatkan semua database yang terkoneksi
   */
  async getDatabases() {
    try {
      const databases = await this.request('/api/database');
      console.log(`🗄️ Ditemukan ${databases.data.length} database`);
      return databases.data;
    } catch (error) {
      console.error('❌ Gagal mengambil database:', error.message);
      throw error;
    }
  }

  /**
   * Dapatkan semua collections
   */
  async getCollections() {
    try {
      const collections = await this.request('/api/collection');
      console.log(`📁 Ditemukan ${collections.length} collections`);
      return collections;
    } catch (error) {
      console.error('❌ Gagal mengambil collections:', error.message);
      throw error;
    }
  }

  /**
   * Buat question/card baru
   */
  async createCard(name, databaseId, query) {
    try {
      const card = await this.request('/api/card', {
        method: 'POST',
        body: JSON.stringify({
          name: name,
          dataset_query: {
            database: databaseId,
            type: 'native',
            native: {
              query: query
            }
          },
          display: 'table',
          visualization_settings: {}
        })
      });
      console.log(`✅ Card "${name}" berhasil dibuat dengan ID: ${card.id}`);
      return card;
    } catch (error) {
      console.error('❌ Gagal membuat card:', error.message);
      throw error;
    }
  }

  /**
   * Logout
   */
  async logout() {
    try {
      await this.request('/api/session', {
        method: 'DELETE'
      });
      this.sessionToken = null;
      console.log('✅ Logout berhasil!');
    } catch (error) {
      console.error('❌ Logout gagal:', error.message);
      throw error;
    }
  }
}

// ========================================
// CONTOH PENGGUNAAN
// ========================================

async function main() {
  // Inisialisasi API client
  const metabase = new MetabaseAPI('http://localhost:3000');

  try {
    // 1. Login
    await metabase.login('your-email@example.com', 'your-password');

    // 2. Dapatkan semua dashboard
    const dashboards = await metabase.getDashboards();
    console.log('\n📊 Dashboard yang tersedia:');
    dashboards.slice(0, 5).forEach(d => {
      console.log(`   - ${d.name} (ID: ${d.id})`);
    });

    // 3. Dapatkan detail dashboard pertama
    if (dashboards.length > 0) {
      console.log('\n📊 Detail dashboard pertama:');
      const dashboard = await metabase.getDashboard(dashboards[0].id);
      console.log(`   Nama: ${dashboard.name}`);
      console.log(`   Deskripsi: ${dashboard.description || 'Tidak ada'}`);
      console.log(`   Jumlah cards: ${dashboard.ordered_cards?.length || 0}`);
    }

    // 4. Dapatkan semua cards
    const cards = await metabase.getCards();
    console.log('\n📝 Cards yang tersedia:');
    cards.slice(0, 5).forEach(c => {
      console.log(`   - ${c.name} (ID: ${c.id})`);
    });

    // 5. Jalankan query dari card pertama
    if (cards.length > 0) {
      console.log(`\n🔄 Menjalankan query dari card: ${cards[0].name}`);
      const results = await metabase.runCardQuery(cards[0].id);
      console.log(`   Rows returned: ${results.row_count || results.data?.rows?.length || 0}`);
    }

    // 6. Dapatkan semua database
    const databases = await metabase.getDatabases();
    console.log('\n🗄️ Database yang terkoneksi:');
    databases.forEach(db => {
      console.log(`   - ${db.name} (${db.engine})`);
    });

    // 7. Dapatkan collections
    const collections = await metabase.getCollections();
    console.log('\n📁 Collections:');
    collections.slice(0, 5).forEach(c => {
      console.log(`   - ${c.name} (ID: ${c.id})`);
    });

    // 8. Logout
    await metabase.logout();

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Jalankan contoh (uncomment untuk menjalankan)
// main();

// Export untuk digunakan di module lain
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MetabaseAPI;
}
