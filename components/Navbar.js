/**
 * Navbar.js
 * ---------
 * Navigasi atas. Menampilkan menu berbeda tergantung status login.
 */

const Navbar = {
  template: `
    <nav class="bg-base border-b-[3px] border-ink sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <router-link to="/" class="flex items-center gap-2 font-display text-sm">
            <span class="text-2xl">📚</span> E-LIBRARY
          </router-link>

          <div class="hidden md:flex items-center gap-1">
            <router-link to="/" class="px-3 py-2 font-bold text-sm">Beranda</router-link>

            <template v-if="isLoggedIn">
              <router-link to="/dashboard" class="px-3 py-2 font-bold text-sm">Dashboard</router-link>
              <router-link to="/buku" class="px-3 py-2 font-bold text-sm">Buku</router-link>
              <router-link to="/kategori" class="px-3 py-2 font-bold text-sm">Kategori</router-link>
              <router-link to="/penulis" class="px-3 py-2 font-bold text-sm">Penulis</router-link>
              <router-link to="/anggota" class="px-3 py-2 font-bold text-sm">Anggota</router-link>
              <router-link to="/peminjaman" class="px-3 py-2 font-bold text-sm">Peminjaman</router-link>
            </template>
          </div>

          <div class="flex items-center gap-3">
            <template v-if="isLoggedIn">
              <span class="hidden sm:inline text-sm font-bold text-ink/70">Hai, <b class="text-ink">{{ userName }}</b></span>
              <button @click="handleLogout" class="brut-sm brut-press-sm bg-punch text-ink px-3 py-1.5 text-sm font-bold">
                Logout
              </button>
            </template>
            <template v-else>
              <router-link to="/login" class="px-4 py-2 font-bold text-sm">Login</router-link>
              <router-link to="/register" class="brut-sm brut-press-sm bg-volt text-base px-4 py-2 font-bold text-sm">Daftar</router-link>
            </template>
          </div>
        </div>

        <!-- Mobile menu -->
        <div v-if="isLoggedIn" class="md:hidden flex flex-wrap gap-2 pb-3">
          <router-link to="/dashboard" class="px-3 py-1.5 text-xs font-bold brut-sm bg-panel">Dashboard</router-link>
          <router-link to="/buku" class="px-3 py-1.5 text-xs font-bold brut-sm bg-panel">Buku</router-link>
          <router-link to="/kategori" class="px-3 py-1.5 text-xs font-bold brut-sm bg-panel">Kategori</router-link>
          <router-link to="/penulis" class="px-3 py-1.5 text-xs font-bold brut-sm bg-panel">Penulis</router-link>
          <router-link to="/anggota" class="px-3 py-1.5 text-xs font-bold brut-sm bg-panel">Anggota</router-link>
          <router-link to="/peminjaman" class="px-3 py-1.5 text-xs font-bold brut-sm bg-panel">Peminjaman</router-link>
        </div>
      </div>
    </nav>
  `,
  data() {
    return {
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
      userName: '',
    };
  },
  created() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.name || 'User';

    window.addEventListener('auth-changed', this.refreshAuthState);
  },
  beforeUnmount() {
    window.removeEventListener('auth-changed', this.refreshAuthState);
  },
  methods: {
    refreshAuthState() {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.userName = user.name || 'User';
    },
    async handleLogout() {
      const confirm = await Swal.fire({
        title: 'Logout?',
        text: 'Anda akan keluar dari sesi admin.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Logout',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#0A0A0A',
        background: '#FFF8E7',
      });

      if (!confirm.isConfirmed) return;

      try {
        await api.post('/logout');
      } catch (e) {
        // Tetap lanjut hapus sesi lokal walau request logout gagal
      }

      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      window.dispatchEvent(new Event('auth-changed'));

      Swal.fire({
        icon: 'success',
        title: 'Berhasil Logout',
        timer: 1200,
        showConfirmButton: false,
        background: '#FFF8E7',
      });

      this.$router.push('/login');
    },
  },
};
