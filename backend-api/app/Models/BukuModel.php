<?php

namespace App\Models;

use CodeIgniter\Model;

class BukuModel extends Model
{
    protected $table            = 'buku';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = [
        'judul', 'kategori_id', 'penulis_id', 'tahun_terbit',
        'stok', 'sinopsis', 'cover_image', 'status',
    ];

    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'judul'       => 'required|min_length[2]|max_length[150]',
        'kategori_id' => 'required|is_natural_no_zero',
        'penulis_id'  => 'required|is_natural_no_zero',
        'stok'        => 'permit_empty|is_natural',
    ];

    /**
     * Ambil semua data buku beserta nama kategori & penulis (JOIN)
     * untuk ditampilkan di tabel frontend tanpa perlu request berkali-kali.
     */
    public function getAllWithRelasi()
    {
        return $this->select('buku.*, kategori.nama_kategori, penulis.nama_penulis, penulis.penerbit')
                    ->join('kategori', 'kategori.id = buku.kategori_id')
                    ->join('penulis', 'penulis.id = buku.penulis_id')
                    ->orderBy('buku.id', 'DESC')
                    ->findAll();
    }

    public function getDetailWithRelasi($id)
    {
        return $this->select('buku.*, kategori.nama_kategori, penulis.nama_penulis, penulis.penerbit')
                    ->join('kategori', 'kategori.id = buku.kategori_id')
                    ->join('penulis', 'penulis.id = buku.penulis_id')
                    ->where('buku.id', $id)
                    ->first();
    }
}
