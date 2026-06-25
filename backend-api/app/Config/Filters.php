<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;
use CodeIgniter\Filters\Cors;
use CodeIgniter\Filters\CSRF;
use CodeIgniter\Filters\DebugToolbar;
use CodeIgniter\Filters\ForceHTTPS;
use CodeIgniter\Filters\Honeypot;
use CodeIgniter\Filters\InvalidChars;
use CodeIgniter\Filters\PageCache;
use CodeIgniter\Filters\PerformanceMetrics;
use CodeIgniter\Filters\SecureHeaders;

class Filters extends BaseConfig
{
    public array $aliases = [
        'csrf'          => CSRF::class,
        'toolbar'       => DebugToolbar::class,
        'honeypot'      => Honeypot::class,
        'invalidchars'  => InvalidChars::class,
        'secureheaders' => SecureHeaders::class,
        'cors'          => \App\Filters\CorsFilter::class,   // CORS Filter custom
        'tokenauth'     => \App\Filters\AuthFilter::class,   // Bearer Token Auth Filter custom
        'forcehttps'    => ForceHTTPS::class,
        'pagecache'     => PageCache::class,
        'performance'   => PerformanceMetrics::class,
    ];

    /**
     * CORS diterapkan secara GLOBAL agar semua request (termasuk preflight OPTIONS)
     * dari frontend VueJS bisa lolos sebelum proses routing/auth.
     */
    public array $globals = [
        'before' => [
            'cors',
        ],
        'after' => [
            // 'toolbar',
        ],
    ];

    public array $methods = [];

    /**
     * tokenauth TIDAK didaftarkan global di sini.
     * Filter ini diterapkan langsung per-route di app/Config/Routes.php
     * menggunakan opsi ['filter' => 'tokenauth'], khusus untuk method
     * POST, PUT, DELETE (manipulasi data master). Endpoint GET tetap publik.
     */
    public array $filters = [];
}
