<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateBukuTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'            => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'judul'         => ['type' => 'VARCHAR', 'constraint' => 150],
            'kategori_id'   => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'penulis_id'    => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'tahun_terbit'  => ['type' => 'YEAR', 'null' => true],
            'stok'          => ['type' => 'INT', 'constraint' => 11, 'default' => 0],
            'sinopsis'      => ['type' => 'TEXT', 'null' => true],
            'cover_image'   => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'status'        => ['type' => 'ENUM', 'constraint' => ['tersedia', 'habis'], 'default' => 'tersedia'],
            'created_at'    => ['type' => 'DATETIME', 'null' => true],
            'updated_at'    => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('kategori_id', 'kategori', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->addForeignKey('penulis_id', 'penulis', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->createTable('buku');
    }

    public function down()
    {
        $this->forge->dropTable('buku');
    }
}
