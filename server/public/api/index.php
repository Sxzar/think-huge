<?php
declare(strict_types=1);

require __DIR__ . '/../../vendor/autoload.php';

use App\Core\{Request, Response, DB, Env, Router};
use App\Controllers\ClientController;
use App\Controllers\TransactionController;

$req = new Request();
$router = new Router();

// health & db 
$router->get('/api/health', fn() => Response::json(['ok' => true, 'env_seen' => Env::get('DB_HOST','not set')]));
$router->get('/api/db-check', function () {
    $now = DB::pdo()->query('SELECT NOW()')->fetchColumn();
    Response::json(['db_time' => $now]);
});

// clients collection
$router->get('/api/clients',  fn($r) => ClientController::index($r));
$router->post('/api/clients', fn($r) => ClientController::store($r));


$router->get('/api/clients/', function($r) {
    $p = $r->path();
    if (preg_match('#^/api/clients/\d+/transactions$#', $p)) {
        return TransactionController::index($r); // GET /api/clients/{id}/transactions
    }
    return ClientController::show($r); // GET /api/clients/{id}
});

$router->post('/api/clients/', function($r) {
    $p = $r->path();
    if (preg_match('#^/api/clients/\d+/transactions$#', $p)) {
        return TransactionController::store($r); // POST /api/clients/{id}/transactions
    }
    return Response::json(['error' => 'Not found'], 404);
});

$router->put('/api/clients/',    fn($r) => ClientController::update($r)); // PUT /api/clients/{id}
$router->delete('/api/clients/', fn($r) => ClientController::destroy($r)); // DELETE /api/clients/{id}

/* transactions update and delete by id (prefix) */
$router->put('/api/transactions/', fn($r) => TransactionController::update($r)); // PUT /api/transactions/{id}
$router->delete('/api/transactions/', fn($r) => TransactionController::destroy($r)); // DELETE /api/transactions/{id}

/* go */
$router->dispatch($req);
