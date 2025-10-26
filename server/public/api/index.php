<?php
declare(strict_types=1);

require __DIR__ . '/../../vendor/autoload.php';

use App\Core\{Request, Response, DB, Env, Router};
use App\Controllers\ClientController;
use App\Models\Client;

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

// clients 
$router->get('/api/clients', fn(Request $r) => ClientController::index($r));
$router->post('/api/clients', fn(Request $r) => ClientController::store($r));
// show, update, delete
$router->get('/api/clients/', fn(Request $r) => ClientController::show($r));
$router->put('/api/clients/', fn(Request $r) => ClientController::update($r));
$router->delete('/api/clients/', fn(Request $r) => ClientController::destroy($r));



// Dispatch the request
$router->dispatch($req);