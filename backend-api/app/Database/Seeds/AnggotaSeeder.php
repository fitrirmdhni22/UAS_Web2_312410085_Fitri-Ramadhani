<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class AnggotaSeeder extends Seeder
{
    public function run()
    {
        $data = [
            ['nama_anggota' => 'Budi Santoso', 'no_hp' => '081234567890', 'alamat' => 'Jl. Merdeka No. 10, Bekasi'],
            ['nama_anggota' => 'Siti Aminah', 'no_hp' => '082345678901', 'alamat' => 'Jl. Sudirman No. 25, Cikarang'],
        ];

        foreach ($data as &$row) {
            $row['created_at'] = date('Y-m-d H:i:s');
            $row['updated_at'] = date('Y-m-d H:i:s');
        }

        $this->db->table('anggota')->insertBatch($data);
    }
}
