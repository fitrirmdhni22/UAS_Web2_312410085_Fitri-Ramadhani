<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class BukuSeeder extends Seeder
{
    public function run()
    {
        $data = [
            [
                'judul' => 'Hujan', 'kategori_id' => 1, 'penulis_id' => 1, 'tahun_terbit' => 2016,
                'stok' => 5, 'sinopsis' => 'Kisah tentang kenangan dan teknologi di masa depan.',
                'cover_image' => null, 'status' => 'tersedia',
            ],
            [
                'judul' => 'One Piece Vol. 1', 'kategori_id' => 2, 'penulis_id' => 2, 'tahun_terbit' => 1997,
                'stok' => 3, 'sinopsis' => 'Petualangan Monkey D. Luffy mencari harta karun One Piece.',
                'cover_image' => null, 'status' => 'tersedia',
            ],
            [
                'judul' => 'Laskar Pelangi', 'kategori_id' => 1, 'penulis_id' => 3, 'tahun_terbit' => 2005,
                'stok' => 4, 'sinopsis' => 'Perjuangan anak-anak Belitung mengejar pendidikan.',
                'cover_image' => null, 'status' => 'tersedia',
            ],
            [
                'judul' => 'Kambing Jantan', 'kategori_id' => 4, 'penulis_id' => 4, 'tahun_terbit' => 2005,
                'stok' => 0, 'sinopsis' => 'Catatan harian seorang remaja yang lucu dan absurd.',
                'cover_image' => null, 'status' => 'habis',
            ],
        ];

        foreach ($data as &$row) {
            $row['created_at'] = date('Y-m-d H:i:s');
            $row['updated_at'] = date('Y-m-d H:i:s');
        }

        $this->db->table('buku')->insertBatch($data);
    }
}
