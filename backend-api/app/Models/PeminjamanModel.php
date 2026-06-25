<?php

namespace App\Models;

use CodeIgniter\Model;

class PeminjamanModel extends Model
{
    protected $table            = 'peminjaman';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = [
        'buku_id', 'anggota_id', 'tanggal_pinjam', 'tanggal_kembali', 'status',
    ];

    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'buku_id'        => 'required|is_natural_no_zero',
        'anggota_id'     => 'required|is_natural_no_zero',
        'tanggal_pinjam' => 'required|valid_date',
    ];

    public function getAllWithRelasi()
    {
        return $this->select('peminjaman.*, buku.judul, anggota.nama_anggota')
                    ->join('buku', 'buku.id = peminjaman.buku_id')
                    ->join('anggota', 'anggota.id = peminjaman.anggota_id')
                    ->orderBy('peminjaman.id', 'DESC')
                    ->findAll();
    }
}
