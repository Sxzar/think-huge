<?php

namespace App\Controllers;

use App\Core\{Request, Response, Guard};
use App\Models\Admin;

final class AdminController
{
    // GET /api/admins?page=&limit=
    public static function index(Request $req)
    {
        Guard::requireAdmin($req); 

        $page  = (int)$req->query('page', 1);
        $limit = (int)$req->query('limit', 20);

        $result = Admin::paginate($page, $limit);
        Response::json($result);
    }

    // POST /api/admins
    // { "email": "foo@bar.com", "password": "secret123" }
    public static function store(Request $req)
    {
        Guard::requireAdmin($req);
        $data = $req->json();

        $email    = isset($data['email']) ? strtolower(trim((string)$data['email'])) : '';
        $password = isset($data['password']) ? (string)$data['password'] : '';

        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return Response::json(['error' => 'Valid email is required'], 422);
        }
        if ($password === '' || strlen($password) < 6) {
            return Response::json(['error' => 'Password must be at least 6 characters'], 422);
        }

        // optional: check duplicate
        $existing = Admin::findByEmail($email);
        if ($existing) {
            return Response::json(['error' => 'Admin with this email already exists'], 422);
        }

        $id = Admin::create($email, $password);

        Response::json(['id' => $id, 'email' => $email], 201);
    }

    // PUT /api/admins/{id}
    // { "email": "...", "password": "..." }  (password optional)
    public static function update(Request $req)
    {
        Guard::requireAdmin($req);

        $path = $req->path();
        if (!preg_match('#^/api/admins/(\d+)$#', $path, $m)) {
            return Response::json(['error' => 'Not found'], 404);
        }
        $id = (int)$m[1];

        $data = $req->json();
        $email    = isset($data['email']) ? strtolower(trim((string)$data['email'])) : '';
        $password = isset($data['password']) ? (string)$data['password'] : null;

        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return Response::json(['error' => 'Valid email is required'], 422);
        }

        $ok = Admin::update($id, $email, $password);
        if (!$ok) {
            return Response::json(['error' => 'Not found or no changes'], 404);
        }

        Response::json(['ok' => true]);
    }

    // DELETE /api/admins/{id}
    public static function destroy(Request $req)
    {
        Guard::requireAdmin($req);

        $path = $req->path();
        if (!preg_match('#^/api/admins/(\d+)$#', $path, $m)) {
            return Response::json(['error' => 'Not found'], 404);
        }
        $id = (int)$m[1];

        $ok = Admin::delete($id);
        if (!$ok) {
            return Response::json(['error' => 'Not found'], 404);
        }

        Response::json(['ok' => true]);
    }
}
