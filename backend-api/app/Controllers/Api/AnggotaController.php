<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\AnggotaModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\RESTful\ResourceController;

class AnggotaController extends ResourceController
{
    use ResponseTrait;

    protected $modelName = AnggotaModel::class;
    protected $format    = 'json';

    public function index()
    {
        $data = $this->model->orderBy('id', 'DESC')->findAll();
        return $this->respond(['status' => 200, 'data' => $data]);
    }

    public function show($id = null)
    {
        $data = $this->model->find($id);
        if (!$data) {
            return $this->failNotFound('Anggota dengan id ' . $id . ' tidak ditemukan.');
        }
        return $this->respond(['status' => 200, 'data' => $data]);
    }

    public function create()
    {
        $rules = ['nama_anggota' => 'required|min_length[3]|max_length[100]'];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = [
            'nama_anggota' => $this->request->getVar('nama_anggota'),
            'no_hp'        => $this->request->getVar('no_hp'),
            'alamat'       => $this->request->getVar('alamat'),
        ];

        $id = $this->model->insert($data);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Anggota berhasil ditambahkan.',
            'data'    => $this->model->find($id),
        ]);
    }

    public function update($id = null)
    {
        $existing = $this->model->find($id);
        if (!$existing) {
            return $this->failNotFound('Anggota dengan id ' . $id . ' tidak ditemukan.');
        }

        $rules = ['nama_anggota' => 'required|min_length[3]|max_length[100]'];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = [
            'nama_anggota' => $this->request->getVar('nama_anggota'),
            'no_hp'        => $this->request->getVar('no_hp'),
            'alamat'       => $this->request->getVar('alamat'),
        ];

        $this->model->update($id, $data);

        return $this->respond([
            'status'  => 200,
            'message' => 'Anggota berhasil diperbarui.',
            'data'    => $this->model->find($id),
        ]);
    }

    public function delete($id = null)
    {
        $existing = $this->model->find($id);
        if (!$existing) {
            return $this->failNotFound('Anggota dengan id ' . $id . ' tidak ditemukan.');
        }

        $this->model->delete($id);

        return $this->respondDeleted([
            'status'  => 200,
            'message' => 'Anggota berhasil dihapus.',
        ]);
    }
}
