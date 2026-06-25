/**
 * Buku.js
 * -------
 * CRUD Buku - tabel data dengan visualisasi cover, kategori, penulis.
 * Modal form mendukung upload file cover_image (multipart/form-data).
 */

const Buku = {
  template: `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <h1 class="text-2xl font-display">Data Buku / Komik</h1>
          <p class="text-ink/60 text-sm mt-1 font-medium">Kelola koleksi buku, stok, dan informasi terkait.</p>
        </div>
        <button @click="openModal()" class="brut-sm brut-press-sm bg-volt text-base px-4 py-2.5 font-bold text-sm">
          + Tambah Buku
        </button>
      </div>

      <div class="brut bg-panel overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-ink text-base">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-bold uppercase">Cover</th>
                <th class="px-5 py-3 text-left text-xs font-bold uppercase">Judul</th>
                <th class="px-5 py-3 text-left text-xs font-bold uppercase">Kategori</th>
                <th class="px-5 py-3 text-left text-xs font-bold uppercase">Penulis</th>
                <th class="px-5 py-3 text-center text-xs font-bold uppercase">Stok</th>
                <th class="px-5 py-3 text-center text-xs font-bold uppercase">Status</th>
                <th class="px-5 py-3 text-right text-xs font-bold uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y-[3px] divide-ink">
              <tr v-if="loading"><td colspan="7" class="px-5 py-8 text-center font-bold text-ink/50">Memuat data...</td></tr>
              <tr v-else-if="items.length === 0"><td colspan="7" class="px-5 py-8 text-center font-bold text-ink/50">Belum ada data buku.</td></tr>
              <tr v-for="item in items" :key="item.id" class="hover:bg-yolk/30">
                <td class="px-5 py-3">
                  <div class="w-12 h-16 border-[3px] border-ink overflow-hidden flex items-center justify-center bg-base">
                    <img v-if="item.cover_url" :src="item.cover_url" class="w-full h-full object-cover" />
                    <span v-else class="text-lg">📕</span>
                  </div>
                </td>
                <td class="px-5 py-3.5 font-bold">{{ item.judul }}</td>
                <td class="px-5 py-3.5 text-ink/70 font-medium">{{ item.nama_kategori }}</td>
                <td class="px-5 py-3.5 text-ink/70 font-medium">{{ item.nama_penulis }}</td>
                <td class="px-5 py-3.5 text-center font-bold">{{ item.stok }}</td>
                <td class="px-5 py-3.5 text-center">
                  <span class="text-xs font-bold px-2 py-1 border-[2px] border-ink"
                    :class="item.status === 'tersedia' ? 'bg-mint' : 'bg-punch'">
                    {{ item.status === 'tersedia' ? 'Tersedia' : 'Habis' }}
                  </span>
                </td>
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
      <div v-if="showModal" class="fixed inset-0 bg-ink/60 flex items-center justify-center px-4 z-50 overflow-y-auto py-8">
        <div class="brut bg-panel w-full max-w-lg p-6 my-auto">
          <h2 class="text-lg font-display mb-4">{{ form.id ? 'Edit' : 'Tambah' }} Buku</h2>
          <form @submit.prevent="handleSubmit" class="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div>
              <label class="block text-sm font-bold mb-1">Judul Buku</label>
              <input v-model="form.judul" required
                class="w-full px-4 py-2.5 border-[3px] border-ink bg-base focus:bg-yolk outline-none transition-colors font-medium" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-bold mb-1">Kategori</label>
                <select v-model="form.kategori_id" required
                  class="w-full px-4 py-2.5 border-[3px] border-ink bg-base focus:bg-yolk outline-none transition-colors font-medium">
                  <option value="" disabled>Pilih kategori</option>
                  <option v-for="k in kategoriList" :key="k.id" :value="k.id">{{ k.nama_kategori }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-bold mb-1">Penulis</label>
                <select v-model="form.penulis_id" required
                  class="w-full px-4 py-2.5 border-[3px] border-ink bg-base focus:bg-yolk outline-none transition-colors font-medium">
                  <option value="" disabled>Pilih penulis</option>
                  <option v-for="p in penulisList" :key="p.id" :value="p.id">{{ p.nama_penulis }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-bold mb-1">Tahun Terbit</label>
                <input v-model="form.tahun_terbit" type="number" min="1900" :max="currentYear"
                  class="w-full px-4 py-2.5 border-[3px] border-ink bg-base focus:bg-yolk outline-none transition-colors font-medium" />
              </div>
              <div>
                <label class="block text-sm font-bold mb-1">Stok</label>
                <input v-model="form.stok" type="number" min="0" required
                  class="w-full px-4 py-2.5 border-[3px] border-ink bg-base focus:bg-yolk outline-none transition-colors font-medium" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold mb-1">Sinopsis</label>
              <textarea v-model="form.sinopsis" rows="3"
                class="w-full px-4 py-2.5 border-[3px] border-ink bg-base focus:bg-yolk outline-none transition-colors font-medium"></textarea>
            </div>

            <div>
              <label class="block text-sm font-bold mb-1">Cover Buku</label>
              <input type="file" accept="image/*" @change="handleFileChange"
                class="w-full text-sm font-medium file:mr-3 file:py-2 file:px-4 file:border-[3px] file:border-ink file:bg-yolk file:font-bold file:cursor-pointer" />
              <div v-if="previewUrl" class="mt-2 w-20 h-28 border-[3px] border-ink overflow-hidden">
                <img :src="previewUrl" class="w-full h-full object-cover" />
              </div>
            </div>

            <p v-if="errorMsg" class="text-sm font-bold border-[3px] border-ink bg-punch px-3 py-2">{{ errorMsg }}</p>

            <div class="flex justify-end gap-2 pt-2 sticky bottom-0 bg-panel">
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
      kategoriList: [],
      penulisList: [],
      loading: true,
      showModal: false,
      submitting: false,
      errorMsg: '',
      selectedFile: null,
      previewUrl: '',
      currentYear: new Date().getFullYear(),
      form: {
        id: null, judul: '', kategori_id: '', penulis_id: '',
        tahun_terbit: '', stok: 0, sinopsis: '',
      },
    };
  },
  created() {
    this.fetchData();
    this.fetchRelasi();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const res = await api.get('/buku');
        this.items = res.data.data;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async fetchRelasi() {
      try {
        const [kategoriRes, penulisRes] = await Promise.all([
          api.get('/kategori'),
          api.get('/penulis'),
        ]);
        this.kategoriList = kategoriRes.data.data;
        this.penulisList = penulisRes.data.data;
      } catch (e) {
        console.error(e);
      }
    },
    openModal(item = null) {
      this.errorMsg = '';
      this.selectedFile = null;
      this.previewUrl = item?.cover_url || '';
      this.form = item
        ? {
            id: item.id, judul: item.judul, kategori_id: item.kategori_id,
            penulis_id: item.penulis_id, tahun_terbit: item.tahun_terbit,
            stok: item.stok, sinopsis: item.sinopsis,
          }
        : { id: null, judul: '', kategori_id: '', penulis_id: '', tahun_terbit: '', stok: 0, sinopsis: '' };
      this.showModal = true;
    },
    handleFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.selectedFile = file;
      this.previewUrl = URL.createObjectURL(file);
    },
    buildFormData() {
      const fd = new FormData();
      fd.append('judul', this.form.judul);
      fd.append('kategori_id', this.form.kategori_id);
      fd.append('penulis_id', this.form.penulis_id);
      fd.append('tahun_terbit', this.form.tahun_terbit || '');
      fd.append('stok', this.form.stok);
      fd.append('sinopsis', this.form.sinopsis || '');
      if (this.selectedFile) {
        fd.append('cover_image', this.selectedFile);
      }
      return fd;
    },
    async handleSubmit() {
      this.submitting = true;
      this.errorMsg = '';
      try {
        const fd = this.buildFormData();
        if (this.form.id) {
          await api.post(`/buku/${this.form.id}`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          await api.post('/buku', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
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
        title: 'Hapus Buku?',
        text: `"${item.judul}" akan dihapus permanen.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#FF3D7F',
        background: '#FFF8E7',
      });
      if (!confirm.isConfirmed) return;

      try {
        await api.delete(`/buku/${item.id}`);
        await this.fetchData();
        Swal.fire({ icon: 'success', title: 'Terhapus', timer: 1000, showConfirmButton: false, background: '#FFF8E7' });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Tidak bisa menghapus data ini.', background: '#FFF8E7' });
      }
    },
  },
};
