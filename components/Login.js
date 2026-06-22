/**
 * Login.js
 * --------
 * Modul Otentikasi: Form login yang menembak API via Axios POST,
 * lalu menyimpan isLoggedIn & token ke localStorage.
 */

const Login = {
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 bg-base">
      <div class="w-full max-w-md">
        <div class="text-center mb-6">
          <div class="text-4xl mb-2">📚</div>
          <h1 class="text-2xl font-display">Login Admin</h1>
          <p class="text-sm font-medium text-ink/60 mt-1">Masuk untuk mengelola data E-Library</p>
        </div>

        <div class="brut bg-panel p-8">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-sm font-bold mb-1">Email</label>
              <input v-model="form.email" type="email" required
                class="w-full px-4 py-2.5 border-[3px] border-ink bg-base focus:bg-yolk outline-none transition-colors font-medium"
                placeholder="admin@elibrary.com" />
            </div>
            <div>
              <label class="block text-sm font-bold mb-1">Password</label>
              <input v-model="form.password" type="password" required
                class="w-full px-4 py-2.5 border-[3px] border-ink bg-base focus:bg-yolk outline-none transition-colors font-medium"
                placeholder="••••••••" />
            </div>

            <p v-if="errorMsg" class="text-sm font-bold border-[3px] border-ink bg-punch px-3 py-2">{{ errorMsg }}</p>

            <button type="submit" :disabled="loading"
              class="w-full brut brut-press bg-ink text-base font-display text-sm py-3 mt-2 disabled:opacity-60">
              {{ loading ? 'Memproses...' : 'Login' }}
            </button>
          </form>

          <p class="text-center text-sm font-bold mt-6">
            Belum punya akun?
            <router-link to="/register" class="text-punch underline">Daftar di sini</router-link>
          </p>

          <div class="mt-6 text-xs font-bold brut-sm bg-mint text-ink p-3 text-center">
            Demo akun: <b>admin@elibrary.com</b> / <b>admin123</b>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      form: { email: '', password: '' },
      loading: false,
      errorMsg: '',
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.errorMsg = '';
      try {
        const res = await api.post('/login', this.form);
        const { token, ...user } = res.data.data;

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        window.dispatchEvent(new Event('auth-changed'));

        await Swal.fire({
          icon: 'success',
          title: 'Login Berhasil',
          text: `Selamat datang, ${user.name}!`,
          timer: 1300,
          showConfirmButton: false,
          background: '#FFF8E7',
        });

        this.$router.push('/dashboard');
      } catch (err) {
        this.errorMsg = err.response?.data?.message || 'Login gagal. Periksa kembali email dan password Anda.';
      } finally {
        this.loading = false;
      }
    },
  },
};
