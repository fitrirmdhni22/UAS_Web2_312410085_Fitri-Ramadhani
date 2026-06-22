/**
 * router.js
 * ---------
 * Konfigurasi Vue Router 4 (SPA - No Hard Reload) beserta
 * Navigation Guards untuk memproteksi halaman admin.
 */

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },

  // Rute Panel Admin - WAJIB LOGIN (meta.requiresAuth)
  { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/kategori', name: 'kategori', component: Kategori, meta: { requiresAuth: true } },
  { path: '/penulis', name: 'penulis', component: Penulis, meta: { requiresAuth: true } },
  { path: '/buku', name: 'buku', component: Buku, meta: { requiresAuth: true } },
  { path: '/anggota', name: 'anggota', component: Anggota, meta: { requiresAuth: true } },
  { path: '/peminjaman', name: 'peminjaman', component: Peminjaman, meta: { requiresAuth: true } },

  // 404 fallback
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(), // pakai hash mode agar mudah di-host statis tanpa config server tambahan
  routes,
});

/**
 * Navigation Guard global:
 * Mencegat pengguna ilegal yang belum login agar terlempar
 * secara otomatis ke halaman login saat mengakses rute requiresAuth.
 */
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'login' });
  } else if ((to.name === 'login' || to.name === 'register') && isLoggedIn) {
    // Kalau sudah login, jangan biarkan balik lagi ke halaman login/register
    next({ name: 'dashboard' });
  } else {
    next();
  }
});
