<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\KategoriModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\RESTful\ResourceController;

class KategoriController extends ResourceController
{
    use ResponseTrait;

    protected $modelName = KategoriModel::class;
    protected $format    = 'json';

    /**
     * GET /api/kategori
     * Publik - tidak perlu token
     */
    public function index()
    {
        $data = $this->model->orderBy('id', 'DESC')->findAll();
        return $this->respond([
            'status' => 200,
            'data'   => $data,
        ]);
    }

    /**
     * GET /api/kategori/{id}
     * Publik - tidak perlu token
     */
    public function show($id = null)
    {
        $data = $this->model->find($id);

        if (!$data) {
            return $this->failNotFound('Kategori dengan id ' . $id . ' tidak ditemukan.');
        }

        return $this->respond([
            'status' => 200,
            'data'   => $data,
        ]);
    }

    /**
     * POST /api/kategori
     * Proteksi token
     */
    public function create()
    {
        $rules = [
            'nama_kategori' => 'required|min_length[3]|max_length[100]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = [
            'nama_kategori' => $this->request->getVar('nama_kategori'),
            'deskripsi'     => $this->request->getVar('deskripsi'),
        ];

        $id = $this->model->insert($data);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Kategori berhasil ditambahkan.',
            'data'    => $this->model->find($id),
        ]);
    }

    /**
     * PUT /api/kategori/{id}
     * Proteksi token
     */
    public function update($id = null)
    {
        $existing = $this->model->find($id);
        if (!$existing) {
            return $this->failNotFound('Kategori dengan id ' . $id . ' tidak ditemukan.');
        }

        $rules = [
            'nama_kategori' => 'required|min_length[3]|max_length[100]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = [
            'nama_kategori' => $this->request->getVar('nama_kategori'),
            'deskripsi'     => $this->request->getVar('deskripsi'),
        ];

        $this->model->update($id, $data);

        return $this->respond([
            'status'  => 200,
            'message' => 'Kategori berhasil diperbarui.',
            'data'    => $this->model->find($id),
        ]);
    }

    /**
     * DELETE /api/kategori/{id}
     * Proteksi token
     */
    public function delete($id = null)
    {
        $existing = $this->model->find($id);
        if (!$existing) {
            return $this->failNotFound('Kategori dengan id ' . $id . ' tidak ditemukan.');
        }

        $this->model->delete($id);

        return $this->respondDeleted([
            'status'  => 200,
            'message' => 'Kategori berhasil dihapus.',
        ]);
    }
}
