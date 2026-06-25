<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class KategoriSeeder extends Seeder
{
    public function run()
    {
        $data = [
            ['nama_kategori' => 'Fiksi', 'deskripsi' => 'Cerita rekaan, novel, dan dunia imajinatif'],
            ['nama_kategori' => 'Komik Aksi', 'deskripsi' => 'Komik dengan tema pertarungan dan petualangan'],
            ['nama_kategori' => 'Edukasi', 'deskripsi' => 'Buku pengetahuan dan pembelajaran'],
            ['nama_kategori' => 'Romance', 'deskripsi' => 'Kisah percintaan dan drama kehidupan'],
            ['nama_kategori' => 'Horror', 'deskripsi' => 'Cerita seram dan misteri mencekam'],
        ];

        foreach ($data as &$row) {
            $row['created_at'] = date('Y-m-d H:i:s');
            $row['updated_at'] = date('Y-m-d H:i:s');
        }

        $this->db->table('kategori')->insertBatch($data);
    }
}
