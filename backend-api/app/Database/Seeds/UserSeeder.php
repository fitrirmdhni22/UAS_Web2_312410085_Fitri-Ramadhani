<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        $data = [
            'name'      => 'Administrator',
            'email'     => 'admin@elibrary.com',
            'password'  => password_hash('admin123', PASSWORD_BCRYPT),
            'role'      => 'admin',
            'api_token' => null,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        // Hindari duplikasi jika seeder dijalankan berulang kali
        $exists = $this->db->table('users')->where('email', $data['email'])->get()->getRow();

        if (!$exists) {
            $this->db->table('users')->insert($data);
        }
    }
}
