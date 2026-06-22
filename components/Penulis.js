/**
 * Penulis.js
 * ----------
 * CRUD Penulis/Penerbit - tabel data + modal box tambah/edit.
 */

const Penulis = {
  template: `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <h1 class="text-2xl font-display">Penulis & Penerbit</h1>
          <p class="text-ink/60 text-sm mt-1 font-medium">Kelola data penulis dan penerbit buku.</p>
        </div>
        <button @click="openModal()" class="brut-sm brut-press-sm bg-volt text-base px-4 py-2.5 font-bold text-sm">
          + Tambah Penulis
        </button>
      </div>

      <div class="brut bg-panel overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-ink text-base">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-bold uppercase">Nama Penulis</th>
                <th class="px-5 py-3 text-left text-xs font-bold uppercase">Penerbit</th>
                <th class="px-5 py-3 text-left text-xs font-bold uppercase">Bio</th>
                <th class="px-5 py-3 text-right text-xs font-bold uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y-[3px] divide-ink">
              <tr v-if="loading"><td colspan="4" class="px-5 py-8 text-center font-bold text-ink/50">Memuat data...</td></tr>
              <tr v-else-if="items.length === 0"><td colspan="4" class="px-5 py-8 text-center font-bold text-ink/50">Belum ada data penulis.</td></tr>
              <tr v-for="item in items" :key="item.id" class="hover:bg-yolk/30">
                <td class="px-5 py-3.5 font-bold">{{ item.nama_penulis }}</td>
                <td class="px-5 py-3.5 text-ink/70 font-medium">{{ item.penerbit || '-' }}</td>
                <td class="px-5 py-3.5 text-ink/70 font-medium max-w-xs truncate">{{ item.bio || '-' }}</td>
                <td class="px-5 py-3.5 text-right space-x-2 whitespace-nowrap">
                  <button @click="openModal(item)" class="text-volt hover:underline text-sm font-bold">Edit</button>
                  <button @click="handleDelete(item)" class="text-punch hover:underline text-sm font-bold">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Tambah/Edit -->
      <div v-if="showModal" class="fixed inset-0 bg-ink/60 flex items-center justify-center px-4 z-50">
        <div class="brut bg-panel w-full max-w-md p-6">
          <h2 class="text-lg font-display mb-4">{{ form.id ? 'Edit' : 'Tambah' }} Penulis</h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-bold mb-1">Nama Penulis</label>
              <input v-model="form.nama_penulis" required
                class="w-full px-4 py-2.5 border-[3px] border-ink bg-base focus:bg-yolk outline-none transition-colors font-medium" />
            </div>
            <div>
              <label class="block text-sm font-bold mb-1">Penerbit</label>
              <input v-model="form.penerbit"
                class="w-full px-4 py-2.5 border-[3px] border-ink bg-base focus:bg-yolk outline-none transition-colors font-medium" />
            </div>
            <div>
              <label class="block text-sm font-bold mb-1">Bio</label>
              <textarea v-model="form.bio" rows="3"
                class="w-full px-4 py-2.5 border-[3px] border-ink bg-base focus:bg-yolk outline-none transition-colors font-medium"></textarea>
            </div>
            <p v-if="errorMsg" class="text-sm font-bold border-[3px] border-ink bg-punch px-3 py-2">{{ errorMsg }}</p>
            <div class="flex justify-end gap-2 pt-2">
              <button type="button" @click="showModal = false" class="px-4 py-2 text-sm font-bold">Batal</button>
              <button type="submit" :disabled="submitting" class="brut-sm brut-press-sm px-4 py-2 text-sm font-bold bg-ink text-base disabled:opacity-60">
                {{ submitting ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      items: [],
      loading: true,
      showModal: false,
      submitting: false,
      errorMsg: '',
      form: { id: null, nama_penulis: '', penerbit: '', bio: '' },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const res = await api.get('/penulis');
        this.items = res.data.data;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    openModal(item = null) {
      this.errorMsg = '';
      this.form = item
        ? { id: item.id, nama_penulis: item.nama_penulis, penerbit: item.penerbit, bio: item.bio }
        : { id: null, nama_penulis: '', penerbit: '', bio: '' };
      this.showModal = true;
    },
    async handleSubmit() {
      this.submitting = true;
      this.errorMsg = '';
      try {
        if (this.form.id) {
          await api.put(`/penulis/${this.form.id}`, this.form);
        } else {
          await api.post('/penulis', this.form);
        }
        this.showModal = false;
        await this.fetchData();
        Swal.fire({ icon: 'success', title: 'Tersimpan', timer: 1100, showConfirmButton: false, background: '#FFF8E7' });
      } catch (err) {
        const errors = err.response?.data?.errors;
        this.errorMsg = errors ? Object.values(errors).join(', ') : (err.response?.data?.message || 'Gagal menyimpan data.');
      } finally {
        this.submitting = false;
      }
    },
    async handleDelete(item) {
      const confirm = await Swal.fire({
        title: 'Hapus Penulis?',
        text: `"${item.nama_penulis}" akan dihapus permanen.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#FF3D7F',
        background: '#FFF8E7',
      });
      if (!confirm.isConfirmed) return;

      try {
        await api.delete(`/penulis/${item.id}`);
        await this.fetchData();
        Swal.fire({ icon: 'success', title: 'Terhapus', timer: 1000, showConfirmButton: false, background: '#FFF8E7' });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Tidak bisa menghapus data ini.', background: '#FFF8E7' });
      }
    },
  },
};
