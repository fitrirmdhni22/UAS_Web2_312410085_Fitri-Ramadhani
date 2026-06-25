<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class PeminjamanSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'buku_id' => 1, 'anggota_id' => 1, 'tanggal_pinjam' => '2026-06-01',
                'tanggal_kembali' => null, 'status' => 'dipinjam',
            ],
            [
                'buku_id' => 2, 'anggota_id' => 2, 'tanggal_pinjam' => '2026-05-20',
                'tanggal_kembali' => '2026-06-01', 'status' => 'dikembalikan',
            ],
        ];

        foreach ($data as &$row) {
            $row['created_at'] = date('Y-m-d H:i:s');
            $row['updated_at'] = date('Y-m-d H:i:s');
        }

        $this->db->table('peminjaman')->insertBatch($data);
    }
}
