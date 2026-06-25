<?php
 
use CodeIgniter\Router\RouteCollection;
 
/**
 * @var RouteCollection $routes
 */
 
// ============================================================
// ROOT - Info API sederhana
// ============================================================
$routes->get('/', static function () {
    return service('response')->setJSON([
        'app'     => 'Bacayuk API',
        'version' => '1.0.0',
        'status'  => 'running',
    ]);
});
 
// ============================================================
// FILE SERVING - Menyajikan cover buku dari folder writable/
// ============================================================
// Folder writable/ TIDAK bisa diakses langsung oleh browser (beda dengan
// public/). Route ini menjembatani permintaan gambar dari frontend agar
// file fisik di writable/uploads/cover_buku/ bisa ditampilkan via URL.
$routes->get('uploads/cover_buku/(:any)', static function ($filename) {
    $path = WRITEPATH . 'uploads/cover_buku/' . basename($filename);
 
    if (!file_exists($path)) {
        return service('response')->setStatusCode(404)->setBody('File tidak ditemukan.');
    }
 
    // Deteksi MIME type dari ekstensi file (bukan mime_content_type()),
    // karena fungsi tersebut butuh extension 'fileinfo' yang kadang
    // belum aktif di sebagian instalasi PHP/XAMPP secara default.
    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    $mimeMap = [
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png'  => 'image/png',
        'gif'  => 'image/gif',
        'webp' => 'image/webp',
        'svg'  => 'image/svg+xml',
        'bmp'  => 'image/bmp',
    ];
    $mime = $mimeMap[$ext] ?? 'application/octet-stream';
 
    return service('response')
        ->setHeader('Content-Type', $mime)
        ->setHeader('Cache-Control', 'public, max-age=86400')
        ->setBody(file_get_contents($path));
});
 
// ============================================================
// GROUP: api - semua endpoint REST
// ============================================================
$routes->group('api', static function ($routes) {
 
    // ---------- CORS PREFLIGHT (WAJIB) ----------
    // Browser mengirim request OPTIONS sebelum POST/PUT/DELETE lintas origin.
    // Tanpa route ini, CI4 akan melempar 404 SEBELUM sempat masuk ke CorsFilter,
    // sehingga browser membaca error sebagai "CORS blocked".
    $routes->options('(:any)', static function () {
        return service('response')->setStatusCode(200);
    });
 
    // ---------- AUTH (Publik) ----------
    $routes->post('register', 'Api\AuthController::register');
    $routes->post('login', 'Api\AuthController::login');
    $routes->post('logout', 'Api\AuthController::logout', ['filter' => 'tokenauth']);
 
    // ---------- DASHBOARD / LANDING PAGE (Publik) ----------
    $routes->get('dashboard/summary', 'Api\DashboardController::summary');
 
    // ---------- KATEGORI ----------
    // GET publik (list & detail), POST/PUT/DELETE wajib token
    $routes->get('kategori', 'Api\KategoriController::index');
    $routes->get('kategori/(:num)', 'Api\KategoriController::show/$1');
    $routes->post('kategori', 'Api\KategoriController::create', ['filter' => 'tokenauth']);
    $routes->put('kategori/(:num)', 'Api\KategoriController::update/$1', ['filter' => 'tokenauth']);
    $routes->delete('kategori/(:num)', 'Api\KategoriController::delete/$1', ['filter' => 'tokenauth']);
 
    // ---------- PENULIS ----------
    $routes->get('penulis', 'Api\PenulisController::index');
    $routes->get('penulis/(:num)', 'Api\PenulisController::show/$1');
    $routes->post('penulis', 'Api\PenulisController::create', ['filter' => 'tokenauth']);
    $routes->put('penulis/(:num)', 'Api\PenulisController::update/$1', ['filter' => 'tokenauth']);
    $routes->delete('penulis/(:num)', 'Api\PenulisController::delete/$1', ['filter' => 'tokenauth']);
 
    // ---------- BUKU ----------
    $routes->get('buku', 'Api\BukuController::index');
    $routes->get('buku/(:num)', 'Api\BukuController::show/$1');
    $routes->post('buku', 'Api\BukuController::create', ['filter' => 'tokenauth']);
    // Catatan: update buku memakai POST dengan field _method=PUT (lihat README) karena
    // file upload pada method PUT murni tidak konsisten ditangani oleh semua browser/Axios.
    $routes->post('buku/(:num)', 'Api\BukuController::update/$1', ['filter' => 'tokenauth']);
    $routes->delete('buku/(:num)', 'Api\BukuController::delete/$1', ['filter' => 'tokenauth']);
 
    // ---------- ANGGOTA ----------
    $routes->get('anggota', 'Api\AnggotaController::index');
    $routes->get('anggota/(:num)', 'Api\AnggotaController::show/$1');
    $routes->post('anggota', 'Api\AnggotaController::create', ['filter' => 'tokenauth']);
    $routes->put('anggota/(:num)', 'Api\AnggotaController::update/$1', ['filter' => 'tokenauth']);
    $routes->delete('anggota/(:num)', 'Api\AnggotaController::delete/$1', ['filter' => 'tokenauth']);
 
    // ---------- PEMINJAMAN ----------
    $routes->get('peminjaman', 'Api\PeminjamanController::index');
    $routes->get('peminjaman/(:num)', 'Api\PeminjamanController::show/$1');
    $routes->post('peminjaman', 'Api\PeminjamanController::create', ['filter' => 'tokenauth']);
    $routes->put('peminjaman/(:num)', 'Api\PeminjamanController::update/$1', ['filter' => 'tokenauth']);
    $routes->delete('peminjaman/(:num)', 'Api\PeminjamanController::delete/$1', ['filter' => 'tokenauth']);
});