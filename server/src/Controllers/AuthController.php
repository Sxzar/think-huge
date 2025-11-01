<?php

namespace App\Controllers;

use App\Core\{Auth, Request, Response};

final class AuthController
{
    /**
     * POST /api/auth/login 
     * body: {"email": "", "password": ""}
     */

    public static function login(Request $req)
    {
        $data = $req->json();
        $email = isset($data['email']) ? strtolower(trim((string)$data['email'])) : '';
        $password = isset($data['password']) ? (string)$data['password'] : '';

        if ($email === '' || $password === '') {
            return Response::json(['error' => 'Email and password are required'], 422);
        }

        $admin = Auth::attempt($email, $password);
        if (!$admin) {
            return Response::json(['error' => 'Invalid credentials'], 401);
        }

        Auth::login($admin['id'], $admin['email']);
        $csrf = Auth::csrfToken();

        Response::json(['ok' => true, 'csrf' => $csrf, 'email' => $admin['email']]);
    }

    /**
     * GET /api/auth/me
     */

    public static function me(Request $req)
    {
        $user = Auth::user();
        if (!$user) {
            return Response::json(['error' => 'Unauthorized'], 401);
        }

        $csrf = Auth::csrfToken();

        Response::json([
            'admin' => $user,
            'csrf'  => $csrf,
        ]);
    }
    public static function logout(Request $req)
    {
        Auth::logout();
        Response::json(['ok' => true]);
    }
}
