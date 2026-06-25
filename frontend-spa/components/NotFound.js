/**
 * NotFound.js
 * -----------
 * Halaman 404 fallback untuk route yang tidak ditemukan.
 */

const NotFound = {
  template: `
    <div class="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div class="text-6xl mb-4">🔍</div>
      <h1 class="text-3xl font-display">404 - Halaman Tidak Ditemukan</h1>
      <p class="text-ink/60 mt-2 font-medium">Halaman yang kamu cari tidak tersedia.</p>
      <router-link to="/" class="mt-6 brut brut-press bg-ink text-base px-5 py-2.5 font-display text-sm">
        Kembali ke Beranda
      </router-link>
    </div>
  `,
};
