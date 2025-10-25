<?php
declare(strict_types=1);

require __DIR__ . '/../../vendor/autoload.php';

use App\Core\Response;
use App\Core\Env;
use App\Core\DB;
use App\Core\Request;

$req = new Request();
$path = $req->path();
$method = $req->method();

if($method == 'GET' && $path == '/api/health') {
    Response::json(['ok' => true, 'env_seen' => Env::get('DB_HOST', 'not set')]);
}

if($method === 'GET' && $path == '/api/db-check') {
    $pdo = DB::pdo();
    $now = $pdo->query('SELECT NOW() AS now_ts')->fetch()['now_ts'] ?? null;
    Response::json(['db_time' => $now]);
}

if($method === 'POST' && $path == '/api/echo') {
    $data = $req->json();
    Response::json(['you_sent' => $data]);
}

// default 404 response
http_response_code(404);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['error' => 'Not Found'], JSON_UNESCAPED_UNICODE);
