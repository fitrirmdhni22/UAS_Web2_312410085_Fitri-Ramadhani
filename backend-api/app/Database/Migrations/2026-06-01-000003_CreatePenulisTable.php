<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePenulisTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'            => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'nama_penulis'  => ['type' => 'VARCHAR', 'constraint' => 100],
            'penerbit'      => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
            'bio'           => ['type' => 'TEXT', 'null' => true],
            'created_at'    => ['type' => 'DATETIME', 'null' => true],
            'updated_at'    => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('penulis');
    }

    public function down()
    {
        $this->forge->dropTable('penulis');
    }
}
