/**
 * Register.js
 * -----------
 * Form pendaftaran akun baru (role default: member).
 */

const Register = {
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 bg-base">
      <div class="w-full max-w-md">
        <div class="text-center mb-6">
          <div class="text-4xl mb-2">📝</div>
          <h1 class="text-2xl font-display">Daftar Akun</h1>
          <p class="text-sm font-medium text-ink/60 mt-1">Buat akun baru untuk mengakses E-Library</p>
        </div>

        <div class="brut bg-panel p-8">
          <form @submit.prevent="handleRegister" class="space-y-4">
            <div>
              <label class="block text-sm font-bold mb-1">Nama Lengkap</label>
              <input v-model="form.name" type="text" required
                class="w-full px-4 py-2.5 border-[3px] border-ink bg-base focus:bg-yolk outline-none transition-colors font-medium"
                placeholder="Nama kamu" />
            </div>
            <div>
              <label class="block text-sm font-bold mb-1">Email</label>
              <input v-model="form.email" type="email" required
                class="w-full px-4 py-2.5 border-[3px] border-ink bg-base focus:bg-yolk outline-none transition-colors font-medium"
                placeholder="kamu@email.com" />
            </div>
            <div>
              <label class="block text-sm font-bold mb-1">Password</label>
              <input v-model="form.password" type="password" required minlength="6"
                class="w-full px-4 py-2.5 border-[3px] border-ink bg-base focus:bg-yolk outline-none transition-colors font-medium"
                placeholder="Minimal 6 karakter" />
            </div>

            <p v-if="errorMsg" class="text-sm font-bold border-[3px] border-ink bg-punch px-3 py-2">{{ errorMsg }}</p>

            <button type="submit" :disabled="loading"
              class="w-full brut brut-press bg-ink text-base font-display text-sm py-3 mt-2 disabled:opacity-60">
              {{ loading ? 'Memproses...' : 'Daftar' }}
            </button>
          </form>

          <p class="text-center text-sm font-bold mt-6">
            Sudah punya akun?
            <router-link to="/login" class="text-punch underline">Login di sini</router-link>
          </p>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      form: { name: '', email: '', password: '' },
      loading: false,
      errorMsg: '',
    };
  },
  methods: {
    async handleRegister() {
      this.loading = true;
      this.errorMsg = '';
      try {
        await api.post('/register', this.form);

        await Swal.fire({
          icon: 'success',
          title: 'Registrasi Berhasil',
          text: 'Silakan login menggunakan akun barumu.',
          confirmButtonColor: '#0A0A0A',
          background: '#FFF8E7',
        });

        this.$router.push('/login');
      } catch (err) {
        const errors = err.response?.data?.errors;
        this.errorMsg = errors ? Object.values(errors).join(', ') : (err.response?.data?.message || 'Registrasi gagal.');
      } finally {
        this.loading = false;
      }
    },
  },
};
