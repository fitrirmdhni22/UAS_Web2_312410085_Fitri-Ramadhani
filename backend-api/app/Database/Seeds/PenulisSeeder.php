<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class PenulisSeeder extends Seeder
{
    public function run()
    {
        $data = [
            ['nama_penulis' => 'Tere Liye', 'penerbit' => 'Gramedia Pustaka Utama', 'bio' => 'Penulis novel Indonesia terkenal dengan banyak karya best seller'],
            ['nama_penulis' => 'Eiichiro Oda', 'penerbit' => 'Shueisha', 'bio' => 'Mangaka asal Jepang, pencipta serial One Piece'],
            ['nama_penulis' => 'Andrea Hirata', 'penerbit' => 'Bentang Pustaka', 'bio' => 'Penulis novel Laskar Pelangi'],
            ['nama_penulis' => 'Raditya Dika', 'penerbit' => 'GagasMedia', 'bio' => 'Penulis sekaligus komedian Indonesia'],
        ];

        foreach ($data as &$row) {
            $row['created_at'] = date('Y-m-d H:i:s');
            $row['updated_at'] = date('Y-m-d H:i:s');
        }

        $this->db->table('penulis')->insertBatch($data);
    }
}
