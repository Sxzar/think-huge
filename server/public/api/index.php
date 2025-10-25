<?php
declare(strict_types=1);

require __DIR__ . '/../../vendor/autoload.php';

use App\Core\Response;
use App\Core\Env;

$method  = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';

if ($method === 'GET' && $path == '/api/health') {
    Response::json(['ok' => true, 'env_seen' => Env::get('DB_HOST', 'not set')]);
}

http_response_code(404);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['error' => 'Not Found'], JSON_UNESCAPED_UNICODE);
