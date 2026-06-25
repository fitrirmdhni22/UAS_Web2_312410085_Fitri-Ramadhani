<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\BukuModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\RESTful\ResourceController;

class BukuController extends ResourceController
{
    use ResponseTrait;

    protected $modelName = BukuModel::class;
    protected $format    = 'json';

    /**
     * GET /api/buku
     * Publik - menampilkan semua buku berikut nama kategori & penulis (JOIN)
     */
    public function index()
    {
        $data = $this->model->getAllWithRelasi();

        // Tambahkan URL lengkap untuk cover image
        foreach ($data as &$row) {
            $row['cover_url'] = $row['cover_image']
                ? base_url('uploads/cover_buku/' . $row['cover_image'])
                : null;
        }

        return $this->respond(['status' => 200, 'data' => $data]);
    }

    /**
     * GET /api/buku/{id}
     * Publik
     */
    public function show($id = null)
    {
        $data = $this->model->getDetailWithRelasi($id);

        if (!$data) {
            return $this->failNotFound('Buku dengan id ' . $id . ' tidak ditemukan.');
        }

        $data['cover_url'] = $data['cover_image']
            ? base_url('uploads/cover_buku/' . $data['cover_image'])
            : null;

        return $this->respond(['status' => 200, 'data' => $data]);
    }

    /**
     * POST /api/buku
     * Proteksi token. Menggunakan multipart/form-data karena ada file upload.
     */
    public function create()
    {
        $rules = [
            'judul'       => 'required|min_length[2]|max_length[150]',
            'kategori_id' => 'required|is_natural_no_zero',
            'penulis_id'  => 'required|is_natural_no_zero',
            'cover_image' => 'permit_empty|is_image[cover_image]|max_size[cover_image,2048]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $fileName = $this->handleCoverUpload();

        $data = [
            'judul'        => $this->request->getVar('judul'),
            'kategori_id'  => $this->request->getVar('kategori_id'),
            'penulis_id'   => $this->request->getVar('penulis_id'),
            'tahun_terbit' => $this->request->getVar('tahun_terbit'),
            'stok'         => $this->request->getVar('stok') ?? 0,
            'sinopsis'     => $this->request->getVar('sinopsis'),
            'status'       => ($this->request->getVar('stok') > 0) ? 'tersedia' : 'habis',
            'cover_image'  => $fileName,
        ];

        $id = $this->model->insert($data);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Buku berhasil ditambahkan.',
            'data'    => $this->model->getDetailWithRelasi($id),
        ]);
    }

    /**
     * PUT /api/buku/{id}
     * Proteksi token. CI4 tidak otomatis parsing file di method PUT,
     * jadi kita pakai trik: frontend kirim via POST dengan _method=PUT (method spoofing)
     * ATAU kita baca file manual dari request. Di sini kita pakai getFiles() yang
     * tetap berfungsi untuk multipart PUT request di CI4.
     */
    public function update($id = null)
    {
        $existing = $this->model->find($id);
        if (!$existing) {
            return $this->failNotFound('Buku dengan id ' . $id . ' tidak ditemukan.');
        }

        $rules = [
            'judul'       => 'required|min_length[2]|max_length[150]',
            'kategori_id' => 'required|is_natural_no_zero',
            'penulis_id'  => 'required|is_natural_no_zero',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $fileName = $this->handleCoverUpload($existing['cover_image']);

        $data = [
            'judul'        => $this->request->getVar('judul'),
            'kategori_id'  => $this->request->getVar('kategori_id'),
            'penulis_id'   => $this->request->getVar('penulis_id'),
            'tahun_terbit' => $this->request->getVar('tahun_terbit'),
            'stok'         => $this->request->getVar('stok') ?? 0,
            'sinopsis'     => $this->request->getVar('sinopsis'),
            'status'       => ($this->request->getVar('stok') > 0) ? 'tersedia' : 'habis',
        ];

        if ($fileName) {
            $data['cover_image'] = $fileName;
        }

        $this->model->update($id, $data);

        return $this->respond([
            'status'  => 200,
            'message' => 'Buku berhasil diperbarui.',
            'data'    => $this->model->getDetailWithRelasi($id),
        ]);
    }

    /**
     * DELETE /api/buku/{id}
     * Proteksi token. Juga menghapus file cover dari storage.
     */
    public function delete($id = null)
    {
        $existing = $this->model->find($id);
        if (!$existing) {
            return $this->failNotFound('Buku dengan id ' . $id . ' tidak ditemukan.');
        }

        if (!empty($existing['cover_image'])) {
            $path = WRITEPATH . 'uploads/cover_buku/' . $existing['cover_image'];
            if (file_exists($path)) {
                unlink($path);
            }
        }

        $this->model->delete($id);

        return $this->respondDeleted([
            'status'  => 200,
            'message' => 'Buku berhasil dihapus.',
        ]);
    }

    /**
     * Helper: menangani file upload cover buku.
     * Jika ada file baru valid, simpan ke writable/uploads/cover_buku
     * dan hapus file lama (jika ada, untuk kasus update).
     */
    private function handleCoverUpload(?string $oldFile = null): ?string
    {
        $file = $this->request->getFile('cover_image');

        if (!$file || !$file->isValid() || $file->hasMoved()) {
            return null;
        }

        $newName = $file->getRandomName();
        $file->move(WRITEPATH . 'uploads/cover_buku', $newName);

        if ($oldFile) {
            $oldPath = WRITEPATH . 'uploads/cover_buku/' . $oldFile;
            if (file_exists($oldPath)) {
                unlink($oldPath);
            }
        }

        return $newName;
    }
}
