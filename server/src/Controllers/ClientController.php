<?php
namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Models\Client;

final class ClientController {
    public static function index(Request $req): void {
        $page = (int)($req->query('page', 1));
        $limit = (int)($req->query('limit', 10));
        $results = Client::paginate(max(1, $page), $limit);
        Response::json($results);
    }

    public static function show(Request $req) {
        $id = $req->paramIdFromPath('/api/clients/');
        if(!$id) return Response::json(['error'=>'Invalid id'], 400);

        $client = Client::find($id);
        if(!$client) return Response::json(['error' => 'Not found'], 404);

        Response::json($client);
    }

    public static function store(Request $req){
        $data = $req->json();
        $name = trim((string)($data['name'] ?? ''));
        $email = isset($data['email']) ? trim((string)$data['email']) : null;
        $note = isset($data['note']) ? trim((string)$data['note']) : null;
        if ($name === '' || mb_strlen($name) > 255) {
            return Response::json(['error' => 'Invalid name'], 422);
        }
        if ($email !== null && $email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return Response::json(['error' => 'Invalid email'], 422);
        }

        $id = Client::create($name, $email ?: null, $note ?: null);
        Response::json(['id' => $id], 201);
    }

    public static function update(Request $req) {
        $id = $req->paramIdFromPath('/api/clients/');
        if(!$id) return Response::json(['error' => 'Invalid id'], 400);

        $data = $req->json();
        $name = trim((string)($data['name'] ?? ''));
        $email = isset($data['email']) ? trim((string)$data['email']) : null;
        $note = isset($data['note']) ? trim((string)$data['note']) : null;

        if( $name === '' || mb_strlen($name) > 255) {
            return Response::json(['error' => 'Invalid name'], 422);
        }
        if ($email !== null && $email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return Response::json(['error' => 'Invalid email'], 422);
        }

        $ok = Client::update($id, $name, $email ?: null, $note ?: null);
        if(!$ok) return Response::json(['error' => 'Not found or not changed'], 404);
        Response::json(['ok' => true]);
     }
    
    public static function destroy(Request $req) {
        $id = $req->paramIdFromPath('/api/clients/');
        if(!$id) return Response::json(['error' => 'Invalid id'], 400);

        $ok = Client::delete($id);
        if(!$ok) return Response::json(['error' => 'Not found'], 404);
        Response::json(['ok' => true]);
    }
}