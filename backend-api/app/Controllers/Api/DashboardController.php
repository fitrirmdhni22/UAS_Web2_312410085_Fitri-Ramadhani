<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\BukuModel;
use App\Models\KategoriModel;
use App\Models\AnggotaModel;
use App\Models\PeminjamanModel;
use CodeIgniter\API\ResponseTrait;

class DashboardController extends BaseController
{
    use ResponseTrait;

    /**
     * GET /api/dashboard/summary
     * Publik - dipakai di Landing Page untuk menampilkan ringkasan total data.
     */
    public function summary()
    {
        $bukuModel       = new BukuModel();
        $kategoriModel   = new KategoriModel();
        $anggotaModel    = new AnggotaModel();
        $peminjamanModel = new PeminjamanModel();

        $data = [
            'total_buku'       => $bukuModel->countAllResults(),
            'total_kategori'   => $kategoriModel->countAllResults(),
            'total_anggota'    => $anggotaModel->countAllResults(),
            'total_dipinjam'   => $peminjamanModel->where('status', 'dipinjam')->countAllResults(),
            'buku_terbaru'     => $bukuModel->getAllWithRelasi(),
        ];

        // Batasi buku terbaru hanya 6 item untuk landing page
        $data['buku_terbaru'] = array_slice($data['buku_terbaru'], 0, 6);

        foreach ($data['buku_terbaru'] as &$row) {
            $row['cover_url'] = $row['cover_image']
                ? base_url('uploads/cover_buku/' . $row['cover_image'])
                : null;
        }

        return $this->respond(['status' => 200, 'data' => $data]);
    }
}
