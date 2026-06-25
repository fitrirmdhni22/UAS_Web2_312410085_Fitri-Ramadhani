<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * CorsFilter
 * ----------
 * Mengizinkan request lintas origin (CORS) dari Frontend VueJS
 * yang berjalan di port/origin berbeda (mis. Live Server / Vite Dev Server)
 * agar tidak diblokir oleh browser.
 */
class CorsFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        // Izinkan origin manapun mengakses API (untuk produksi, ganti '*' dengan domain spesifik)
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With');
        header('Access-Control-Allow-Credentials: true');

        // Browser akan mengirim preflight request method OPTIONS sebelum request asli.
        // Kita langsung balas 200 OK tanpa lanjut ke controller.
        if ($request->getMethod() === 'OPTIONS') {
            $response = service('response');
            $response->setStatusCode(200);
            $response->send();
            exit;
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        $response->setHeader('Access-Control-Allow-Origin', '*');
    }
}
