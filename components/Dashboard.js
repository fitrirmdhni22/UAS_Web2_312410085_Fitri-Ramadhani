/**
 * Dashboard.js
 * ------------
 * Dashboard utama admin setelah login. Menampilkan ringkasan & shortcut menu.
 */

const Dashboard = {
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 class="text-2xl font-display">Dashboard Admin</h1>
      <p class="text-ink/60 mt-1 font-medium">Ringkasan data sistem E-Library kamu.</p>

      <div v-if="loading" class="text-center font-bold text-ink/50 py-10">Memuat data...</div>

      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div class="brut-sm bg-panel p-6 text-center">
          <p class="text-3xl font-display">{{ summary.total_buku ?? 0 }}</p>
          <p class="text-sm font-bold text-ink/70 mt-1">Total Buku</p>
        </div>
        <div class="brut-sm bg-panel p-6 text-center">
          <p class="text-3xl font-display">{{ summary.total_kategori ?? 0 }}</p>
          <p class="text-sm font-bold text-ink/70 mt-1">Kategori</p>
        </div>
        <div class="brut-sm bg-panel p-6 text-center">
          <p class="text-3xl font-display">{{ summary.total_anggota ?? 0 }}</p>
          <p class="text-sm font-bold text-ink/70 mt-1">Anggota</p>
        </div>
        <div class="brut-sm bg-punch p-6 text-center">
          <p class="text-3xl font-display">{{ summary.total_dipinjam ?? 0 }}</p>
          <p class="text-sm font-bold text-ink/90 mt-1">Sedang Dipinjam</p>
        </div>
      </div>

      <h2 class="text-lg font-display mt-10 mb-4">Menu Cepat</h2>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <router-link to="/buku" class="brut-sm brut-press-sm bg-panel p-5 text-center cursor-pointer">
          <div class="text-3xl mb-2">📕</div>
          <p class="font-bold text-sm">Kelola Buku</p>
        </router-link>
        <router-link to="/kategori" class="brut-sm brut-press-sm bg-panel p-5 text-center cursor-pointer">
          <div class="text-3xl mb-2">🏷️</div>
          <p class="font-bold text-sm">Kategori</p>
        </router-link>
        <router-link to="/penulis" class="brut-sm brut-press-sm bg-panel p-5 text-center cursor-pointer">
          <div class="text-3xl mb-2">✍️</div>
          <p class="font-bold text-sm">Penulis</p>
        </router-link>
        <router-link to="/anggota" class="brut-sm brut-press-sm bg-panel p-5 text-center cursor-pointer">
          <div class="text-3xl mb-2">👤</div>
          <p class="font-bold text-sm">Anggota</p>
        </router-link>
        <router-link to="/peminjaman" class="brut-sm brut-press-sm bg-panel p-5 text-center cursor-pointer">
          <div class="text-3xl mb-2">🔄</div>
          <p class="font-bold text-sm">Peminjaman</p>
        </router-link>
      </div>
    </div>
  `,
  data() {
    return { loading: true, summary: {} };
  },
  async created() {
    try {
      const res = await api.get('/dashboard/summary');
      this.summary = res.data.data;
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  },
};
