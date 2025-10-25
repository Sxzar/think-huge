<?php
declare(strict_types=1);

require __DIR__ . '/../../vendor/autoload.php';

use App\Core\Response;
use App\Core\Env;
use App\Core\DB;
use App\Core\Request;
use App\Core\Router;

$req = new Request();
$router = new Router();

// Register routes

$router->get('/api/health', function() {
    Response::json(['ok' => true, 'env_seen' => Env::get('DB_HOST', 'not set')]);
});

$router->get('/api/db-check', function(){
    $pdo = DB::pdo();
    $now = $pdo->query('SELECT NOW() AS now_ts')->fetch()['now_ts'] ?? null;
    Response::json(['db_time' => $now]);
});

$router->post('/api/echo', function(Request $req) {
    $data = $req->json();
    Response::json(['you_sent' => $data]);
});

// Dispatch the request
$router->dispatch($req);