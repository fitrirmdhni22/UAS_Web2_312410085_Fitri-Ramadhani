<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\PenulisModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\RESTful\ResourceController;

class PenulisController extends ResourceController
{
    use ResponseTrait;

    protected $modelName = PenulisModel::class;
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
            return $this->failNotFound('Penulis dengan id ' . $id . ' tidak ditemukan.');
        }
        return $this->respond(['status' => 200, 'data' => $data]);
    }

    public function create()
    {
        $rules = ['nama_penulis' => 'required|min_length[3]|max_length[100]'];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = [
            'nama_penulis' => $this->request->getVar('nama_penulis'),
            'penerbit'     => $this->request->getVar('penerbit'),
            'bio'          => $this->request->getVar('bio'),
        ];

        $id = $this->model->insert($data);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Penulis berhasil ditambahkan.',
            'data'    => $this->model->find($id),
        ]);
    }

    public function update($id = null)
    {
        $existing = $this->model->find($id);
        if (!$existing) {
            return $this->failNotFound('Penulis dengan id ' . $id . ' tidak ditemukan.');
        }

        $rules = ['nama_penulis' => 'required|min_length[3]|max_length[100]'];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = [
            'nama_penulis' => $this->request->getVar('nama_penulis'),
            'penerbit'     => $this->request->getVar('penerbit'),
            'bio'          => $this->request->getVar('bio'),
        ];

        $this->model->update($id, $data);

        return $this->respond([
            'status'  => 200,
            'message' => 'Penulis berhasil diperbarui.',
            'data'    => $this->model->find($id),
        ]);
    }

    public function delete($id = null)
    {
        $existing = $this->model->find($id);
        if (!$existing) {
            return $this->failNotFound('Penulis dengan id ' . $id . ' tidak ditemukan.');
        }

        $this->model->delete($id);

        return $this->respondDeleted([
            'status'  => 200,
            'message' => 'Penulis berhasil dihapus.',
        ]);
    }
}
