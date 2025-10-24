<?php
header('Content-Type: application/json; charset=utf-8');

try {
    $dsn = sprintf(
        'mysql:host=%s; dbname=%s; charset=utf8mb4',
        getenv('DB_HOST') ?: 'mysql',
        getenv('DB_NAME') ?: 'app'
    );

    $pdo = new PDO (
        $dsn, 
        getenv('DB_USER') ?: 'app',
        getenv('DB_PASS') ?: 'app',
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    $stmt = $pdo->query('SELECT NOW() AS now_ts');
    $row = $stmt->fetch();

    echo json_encode([
        'db' => 'ok',
        'current_time' => $row['now_ts'],
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}