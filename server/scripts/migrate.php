<?php
declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';

use App\Core\DB;

$pdo = DB::pdo();

$pdo->exec("CREATE TABLE IF NOT EXISTS migrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$applied = $pdo->query("SELECT filename FROM migrations")->fetchAll(PDO::FETCH_COLUMN);
$files = glob(__DIR__ . '/../migrations/*.sql');
sort($files);

foreach ($files as $file) {
    $name = basename($file);
    if(in_array($name, $applied, true)) continue;

    echo "Applying: {$name}\n";

    $sql = file_get_contents($file);
    $pdo->exec($sql);
    $stmt = $pdo->prepare("INSERT INTO migrations (filename) VALUES (?)");
    $stmt->execute([$name]);
    echo "Done: {$name}\n";
}
