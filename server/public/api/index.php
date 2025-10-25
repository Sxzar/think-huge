<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path   = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';

// health check
if ($method === 'GET' && $path === '/api/health') {
    echo json_encode(['ok' => true, 'time' => date('Y-m-d H:i:s')]);
    exit;
}

//real routes here
http_response_code(404);
echo json_encode(['error' => 'Not found']);
