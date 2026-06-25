<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call('UserSeeder');
        $this->call('KategoriSeeder');
        $this->call('PenulisSeeder');
        $this->call('BukuSeeder');
        $this->call('AnggotaSeeder');
        $this->call('PeminjamanSeeder');

        echo "Seeding selesai! Akun admin: admin@elibrary.com / admin123\n";
    }
}
