<?php
declare(strict_types=1);

require __DIR__ . '/../../vendor/autoload.php';

use App\Core\{Request, Response, DB, Env, Router, Guard};
use App\Controllers\{ClientController, TransactionController, AuthController, ReportController};


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
$router->post('/api/clients', function($r){
    Guard::requireAdmin($r);
    ClientController::store($r);
});


$router->get('/api/clients/', function($r) {
    $p = $r->path();
    if (preg_match('#^/api/clients/\d+/transactions$#', $p)) {
        return TransactionController::index($r); // GET /api/clients/{id}/transactions
    }
    return ClientController::show($r); // GET /api/clients/{id}
});

$router->post('/api/clients/', function($r) {
    Guard::requireAdmin($r);
    $p = $r->path();
    if (preg_match('#^/api/clients/\d+/transactions$#', $p)) {
        return TransactionController::store($r); // POST /api/clients/{id}/transactions
    }
    return Response::json(['error' => 'Not found'], 404);
});

// PUT /api/clients/{id}
$router->put('/api/clients/',    function($r){
    Guard::requireAdmin($r);
    ClientController::update($r);
});

// DELETE /api/clients/{id}
$router->delete('/api/clients/', function($r){
    Guard::requireAdmin($r);
    ClientController::destroy($r);
});

/* transactions update and delete by id (prefix) */


// PUT /api/transactions/{id}
$router->put('/api/transactions/', function($r) {
    Guard::requireAdmin($r);
    TransactionController::update($r); 
});

// DELETE /api/transactions/{id}
$router->delete('/api/transactions/', function($r){
    Guard::requireAdmin($r);
    TransactionController::destroy($r);
}); 

/* auth */
$router->post('/api/auth/login', fn($r)=>AuthController::login($r));
$router->get('/api/auth/me', fn($r)=>AuthController::me($r));
$router->post('/api/auth/logout', fn($r)=>AuthController::logout($r));

// Reports (admin session required; GET so no CSRF header needed)
$router->get('/api/reports/summary', function($r){
    Guard::requireAdmin($r);
    return ReportController::summary($r);
});

/* go */
$router->dispatch($req);
