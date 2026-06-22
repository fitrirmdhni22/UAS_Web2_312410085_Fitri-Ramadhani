/**
 * Home.js
 * -------
 * Landing Page - halaman publik (tanpa login).
 * Menampilkan ringkasan total data perpustakaan.
 */

const Home = {
  template: `
    <div>
      <!-- Hero Section -->
      <section class="border-b-[3px] border-ink">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 class="text-4xl sm:text-5xl font-display tracking-tight leading-tight">Selamat Datang di E-Library</h1>
          <p class="mt-4 text-lg text-ink/75 max-w-2xl mx-auto font-medium">
            Sistem informasi rental buku & komik digital — temukan, pinjam, dan kelola koleksi bacaan favoritmu dengan mudah.
          </p>
          <div class="mt-8 flex justify-center gap-4">
            <router-link to="/login" class="brut brut-press bg-ink text-base px-6 py-3 font-display text-sm">
              Masuk sebagai Admin
            </router-link>
            <router-link to="/register" class="brut brut-press bg-panel text-ink px-6 py-3 font-display text-sm">
              Daftar Akun
            </router-link>
          </div>
        </div>
      </section>

      <!-- Ringkasan Statistik -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div v-if="loading" class="text-center font-bold text-ink/50 py-10">Memuat data ringkasan...</div>
        <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
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
      </section>

      <!-- Buku Terbaru -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 class="text-2xl font-display mb-6">📖 Koleksi Buku Terbaru</h2>

        <div v-if="loading" class="text-center font-bold text-ink/50 py-10">Memuat koleksi...</div>
        <div v-else-if="!summary.buku_terbaru || summary.buku_terbaru.length === 0" class="text-center font-bold text-ink/50 py-10">
          Belum ada data buku.
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          <div v-for="b in summary.buku_terbaru" :key="b.id" class="brut-sm brut-press-sm bg-panel overflow-hidden cursor-pointer">
            <div class="aspect-[3/4] bg-base flex items-center justify-center overflow-hidden border-b-[3px] border-ink">
              <img v-if="b.cover_url" :src="b.cover_url" class="w-full h-full object-cover" :alt="b.judul" />
              <span v-else class="text-4xl">📕</span>
            </div>
            <div class="p-3">
              <p class="font-bold text-sm line-clamp-2">{{ b.judul }}</p>
              <p class="text-xs font-medium text-ink/60 mt-1">{{ b.nama_kategori }}</p>
              <span class="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 border-[2px] border-ink"
                :class="b.status === 'tersedia' ? 'bg-mint' : 'bg-punch'">
                {{ b.status === 'tersedia' ? 'Tersedia' : 'Habis' }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  data() {
    return {
      loading: true,
      summary: {},
    };
  },
  async created() {
    try {
      const res = await api.get('/dashboard/summary');
      this.summary = res.data.data;
    } catch (e) {
      console.error('Gagal memuat ringkasan dashboard', e);
    } finally {
      this.loading = false;
    }
  },
};
