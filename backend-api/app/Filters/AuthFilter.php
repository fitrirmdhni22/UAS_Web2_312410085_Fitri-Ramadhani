<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use App\Models\UserModel;

/**
 * AuthFilter
 * ----------
 * Memproteksi endpoint POST, PUT, DELETE agar hanya bisa diakses
 * jika request menyertakan Authorization: Bearer <token> yang valid.
 *
 * Token sederhana berbasis tabel `users` (kolom api_token) yang di-generate
 * saat login, lalu dicocokkan di sini.
 */
class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getServer('HTTP_AUTHORIZATION') ?? $request->getHeaderLine('Authorization');

        if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return service('response')
                ->setStatusCode(401)
                ->setJSON([
                    'status'  => 401,
                    'message' => 'Unauthorized. Token tidak ditemukan pada header Authorization.',
                ]);
        }

        $token = $matches[1];

        $userModel = new UserModel();
        $user = $userModel->where('api_token', $token)->first();

        if (!$user) {
            return service('response')
                ->setStatusCode(401)
                ->setJSON([
                    'status'  => 401,
                    'message' => 'Unauthorized. Token tidak valid atau sudah kedaluwarsa.',
                ]);
        }

        // Simpan data user yang sedang login ke request agar bisa diakses controller
        $request->user = $user;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Tidak ada proses tambahan setelah response
    }
}
