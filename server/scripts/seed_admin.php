<?php 
require __DIR__ . '../../vendor/autoload.php';

use App\Core\DB;

$email = $argv[1] ?? 'admin@example.com';
$password = $argv[2] ?? 'secret123';

try {
    $pdo = DB::pdo();

    $hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare('INSERT INTO admins (email, password_hash)
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)');

    $stmt->execute([$email, $hash]);

    echo "Admin seeded successfully. \n";
    echo "Email: {$email}\n";
    echo "Password: {$password}\n";
} catch (Throwable $e) {
    echo "Failed to seed admin: " . $e->getMessage() . "\n";
    exit(1);
}