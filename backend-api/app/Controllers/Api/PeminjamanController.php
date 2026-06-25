<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\PeminjamanModel;
use App\Models\BukuModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\RESTful\ResourceController;

class PeminjamanController extends ResourceController
{
    use ResponseTrait;

    protected $modelName = PeminjamanModel::class;
    protected $format    = 'json';

    public function index()
    {
        $data = $this->model->getAllWithRelasi();
        return $this->respond(['status' => 200, 'data' => $data]);
    }

    public function show($id = null)
    {
        $data = $this->model->find($id);
        if (!$data) {
            return $this->failNotFound('Data peminjaman dengan id ' . $id . ' tidak ditemukan.');
        }
        return $this->respond(['status' => 200, 'data' => $data]);
    }

    /**
     * POST /api/peminjaman
     * Membuat transaksi peminjaman baru sekaligus mengurangi stok buku.
     */
    public function create()
    {
        $rules = [
            'buku_id'        => 'required|is_natural_no_zero',
            'anggota_id'     => 'required|is_natural_no_zero',
            'tanggal_pinjam' => 'required|valid_date',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $bukuModel = new BukuModel();
        $buku = $bukuModel->find($this->request->getVar('buku_id'));

        if (!$buku) {
            return $this->failNotFound('Buku tidak ditemukan.');
        }

        if ($buku['stok'] <= 0) {
            return $this->fail('Stok buku habis, tidak bisa dipinjam.', 400);
        }

        $data = [
            'buku_id'        => $this->request->getVar('buku_id'),
            'anggota_id'     => $this->request->getVar('anggota_id'),
            'tanggal_pinjam' => $this->request->getVar('tanggal_pinjam'),
            'status'         => 'dipinjam',
        ];

        $id = $this->model->insert($data);

        // Kurangi stok buku otomatis
        $stokBaru = $buku['stok'] - 1;
        $bukuModel->update($buku['id'], [
            'stok'   => $stokBaru,
            'status' => $stokBaru > 0 ? 'tersedia' : 'habis',
        ]);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Peminjaman berhasil dicatat.',
            'data'    => $this->model->find($id),
        ]);
    }

    /**
     * PUT /api/peminjaman/{id}
     * Bisa dipakai untuk update status, mis. mengembalikan buku (stok bertambah lagi).
     */
    public function update($id = null)
    {
        $existing = $this->model->find($id);
        if (!$existing) {
            return $this->failNotFound('Data peminjaman dengan id ' . $id . ' tidak ditemukan.');
        }

        $rules = [
            'status' => 'required|in_list[dipinjam,dikembalikan,terlambat]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $statusBaru = $this->request->getVar('status');
        $data = ['status' => $statusBaru];

        if ($statusBaru === 'dikembalikan') {
            $data['tanggal_kembali'] = $this->request->getVar('tanggal_kembali') ?? date('Y-m-d');

            // Jika sebelumnya belum dikembalikan, tambah stok buku kembali
            if ($existing['status'] !== 'dikembalikan') {
                $bukuModel = new BukuModel();
                $buku = $bukuModel->find($existing['buku_id']);
                if ($buku) {
                    $stokBaru = $buku['stok'] + 1;
                    $bukuModel->update($buku['id'], [
                        'stok'   => $stokBaru,
                        'status' => 'tersedia',
                    ]);
                }
            }
        }

        $this->model->update($id, $data);

        return $this->respond([
            'status'  => 200,
            'message' => 'Data peminjaman berhasil diperbarui.',
            'data'    => $this->model->find($id),
        ]);
    }

    public function delete($id = null)
    {
        $existing = $this->model->find($id);
        if (!$existing) {
            return $this->failNotFound('Data peminjaman dengan id ' . $id . ' tidak ditemukan.');
        }

        $this->model->delete($id);

        return $this->respondDeleted([
            'status'  => 200,
            'message' => 'Data peminjaman berhasil dihapus.',
        ]);
    }
}
