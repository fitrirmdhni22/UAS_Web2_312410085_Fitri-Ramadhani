<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserModel;
use CodeIgniter\API\ResponseTrait;

class AuthController extends BaseController
{
    use ResponseTrait;

    protected UserModel $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    /**
     * POST /api/register
     * Mendaftarkan user baru (role default: member)
     */
    public function register()
    {
        $rules = [
            'name'     => 'required|min_length[3]|max_length[100]',
            'email'    => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|min_length[6]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = [
            'name'     => $this->request->getVar('name'),
            'email'    => $this->request->getVar('email'),
            'password' => password_hash($this->request->getVar('password'), PASSWORD_BCRYPT),
            'role'     => 'member',
        ];

        $this->userModel->insert($data);

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Registrasi berhasil. Silakan login.',
        ]);
    }

    /**
     * POST /api/login
     * Memvalidasi kredensial dan men-generate token baru
     */
    public function login()
    {
        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $email    = $this->request->getVar('email');
        $password = $this->request->getVar('password');

        $user = $this->userModel->where('email', $email)->first();

        if (!$user || !password_verify($password, $user['password'])) {
            return $this->failUnauthorized('Email atau password yang Anda masukkan salah.');
        }

        // Generate token baru setiap kali login
        $token = bin2hex(random_bytes(32));
        $this->userModel->update($user['id'], ['api_token' => $token]);

        return $this->respond([
            'status'  => 200,
            'message' => 'Login berhasil.',
            'data'    => [
                'id'    => $user['id'],
                'name'  => $user['name'],
                'email' => $user['email'],
                'role'  => $user['role'],
                'token' => $token,
            ],
        ]);
    }

    /**
     * POST /api/logout
     * Menghapus token user yang sedang login (perlu Bearer Token)
     */
    public function logout()
    {
        $authHeader = $this->request->getServer('HTTP_AUTHORIZATION') ?? $this->request->getHeaderLine('Authorization');

        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            $user  = $this->userModel->where('api_token', $token)->first();
            if ($user) {
                $this->userModel->update($user['id'], ['api_token' => null]);
            }
        }

        return $this->respond([
            'status'  => 200,
            'message' => 'Logout berhasil.',
        ]);
    }
}
