/**
 * Peminjaman.js
 * -------------
 * Transaksi peminjaman buku. Saat status diubah jadi "dikembalikan",
 * backend otomatis menambah kembali stok buku terkait.
 */

const Peminjaman = {
  template: `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <h1 class="text-2xl font-display">Transaksi Peminjaman</h1>
          <p class="text-ink/60 text-sm mt-1 font-medium">Catat peminjaman buku oleh anggota & status pengembalian.</p>
        </div>
        <button @click="openModal()" class="brut-sm brut-press-sm bg-volt text-base px-4 py-2.5 font-bold text-sm">
          + Catat Peminjaman
        </button>
      </div>

      <div class="brut bg-panel overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-ink text-base">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-bold uppercase">Buku</th>
                <th class="px-5 py-3 text-left text-xs font-bold uppercase">Anggota</th>
                <th class="px-5 py-3 text-left text-xs font-bold uppercase">Tgl Pinjam</th>
                <th class="px-5 py-3 text-left text-xs font-bold uppercase">Tgl Kembali</th>
                <th class="px-5 py-3 text-center text-xs font-bold uppercase">Status</th>
                <th class="px-5 py-3 text-right text-xs font-bold uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y-[3px] divide-ink">
              <tr v-if="loading"><td colspan="6" class="px-5 py-8 text-center font-bold text-ink/50">Memuat data...</td></tr>
              <tr v-else-if="items.length === 0"><td colspan="6" class="px-5 py-8 text-center font-bold text-ink/50">Belum ada transaksi peminjaman.</td></tr>
              <tr v-for="item in items" :key="item.id" class="hover:bg-yolk/30">
                <td class="px-5 py-3.5 font-bold">{{ item.judul }}</td>
                <td class="px-5 py-3.5 text-ink/70 font-medium">{{ item.nama_anggota }}</td>
                <td class="px-5 py-3.5 text-ink/70 font-medium">{{ item.tanggal_pinjam }}</td>
                <td class="px-5 py-3.5 text-ink/70 font-medium">{{ item.tanggal_kembali || '-' }}</td>
                <td class="px-5 py-3.5 text-center">
                  <span class="text-xs font-bold px-2 py-1 border-[2px] border-ink"
                    :class="statusBadge(item.status)">
                    {{ statusLabel(item.status) }}
                  </span>
                </td>
                <td class="px-5 py-3.5 text-right space-x-2 whitespace-nowrap">
                  <button v-if="item.status === 'dipinjam'" @click="handleKembalikan(item)" class="text-mint hover:underline text-sm font-bold" style="color:#00A37D;">Kembalikan</button>
                  <button @click="handleDelete(item)" class="text-punch hover:underline text-sm font-bold">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Tambah -->
      <div v-if="showModal" class="fixed inset-0 bg-ink/60 flex items-center justify-center px-4 z-50">
        <div class="brut bg-panel w-full max-w-md p-6">
          <h2 class="text-lg font-display mb-4">Catat Peminjaman Baru</h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-bold mb-1">Buku</label>
              <select v-model="form.buku_id" required
                class="w-full px-4 py-2.5 border-[3px] border-ink bg-base focus:bg-yolk outline-none transition-colors font-medium">
                <option value="" disabled>Pilih buku</option>
                <option v-for="b in bukuTersedia" :key="b.id" :value="b.id">{{ b.judul }} (stok: {{ b.stok }})</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-bold mb-1">Anggota</label>
              <select v-model="form.anggota_id" required
                class="w-full px-4 py-2.5 border-[3px] border-ink bg-base focus:bg-yolk outline-none transition-colors font-medium">
                <option value="" disabled>Pilih anggota</option>
                <option v-for="a in anggotaList" :key="a.id" :value="a.id">{{ a.nama_anggota }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-bold mb-1">Tanggal Pinjam</label>
              <input v-model="form.tanggal_pinjam" type="date" required
                class="w-full px-4 py-2.5 border-[3px] border-ink bg-base focus:bg-yolk outline-none transition-colors font-medium" />
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
      bukuList: [],
      anggotaList: [],
      loading: true,
      showModal: false,
      submitting: false,
      errorMsg: '',
      form: { buku_id: '', anggota_id: '', tanggal_pinjam: '' },
    };
  },
  computed: {
    bukuTersedia() {
      return this.bukuList.filter((b) => b.stok > 0);
    },
  },
  created() {
    this.fetchData();
    this.fetchRelasi();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const res = await api.get('/peminjaman');
        this.items = res.data.data;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async fetchRelasi() {
      try {
        const [bukuRes, anggotaRes] = await Promise.all([
          api.get('/buku'),
          api.get('/anggota'),
        ]);
        this.bukuList = bukuRes.data.data;
        this.anggotaList = anggotaRes.data.data;
      } catch (e) {
        console.error(e);
      }
    },
    statusLabel(status) {
      return { dipinjam: 'Dipinjam', dikembalikan: 'Dikembalikan', terlambat: 'Terlambat' }[status] || status;
    },
    statusBadge(status) {
      return {
        dipinjam: 'bg-yolk',
        dikembalikan: 'bg-mint',
        terlambat: 'bg-punch',
      }[status] || 'bg-panel';
    },
    openModal() {
      this.errorMsg = '';
      this.form = { buku_id: '', anggota_id: '', tanggal_pinjam: new Date().toISOString().slice(0, 10) };
      this.showModal = true;
    },
    async handleSubmit() {
      this.submitting = true;
      this.errorMsg = '';
      try {
        await api.post('/peminjaman', this.form);
        this.showModal = false;
        await Promise.all([this.fetchData(), this.fetchRelasi()]);
        Swal.fire({ icon: 'success', title: 'Tersimpan', timer: 1100, showConfirmButton: false, background: '#FFF8E7' });
      } catch (err) {
        this.errorMsg = err.response?.data?.message || 'Gagal menyimpan transaksi.';
      } finally {
        this.submitting = false;
      }
    },
    async handleKembalikan(item) {
      const confirm = await Swal.fire({
        title: 'Tandai Dikembalikan?',
        text: `Buku "${item.judul}" akan ditandai sudah dikembalikan dan stok akan bertambah.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Kembalikan',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#00D9A3',
        background: '#FFF8E7',
      });
      if (!confirm.isConfirmed) return;

      try {
        await api.put(`/peminjaman/${item.id}`, {
          status: 'dikembalikan',
          tanggal_kembali: new Date().toISOString().slice(0, 10),
        });
        await Promise.all([this.fetchData(), this.fetchRelasi()]);
        Swal.fire({ icon: 'success', title: 'Buku Dikembalikan', timer: 1100, showConfirmButton: false, background: '#FFF8E7' });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Gagal memperbarui status.', background: '#FFF8E7' });
      }
    },
    async handleDelete(item) {
      const confirm = await Swal.fire({
        title: 'Hapus Data Peminjaman?',
        text: 'Data transaksi ini akan dihapus permanen.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#FF3D7F',
        background: '#FFF8E7',
      });
      if (!confirm.isConfirmed) return;

      try {
        await api.delete(`/peminjaman/${item.id}`);
        await this.fetchData();
        Swal.fire({ icon: 'success', title: 'Terhapus', timer: 1000, showConfirmButton: false, background: '#FFF8E7' });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Tidak bisa menghapus data ini.', background: '#FFF8E7' });
      }
    },
  },
};
