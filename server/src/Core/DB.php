<?php

namespace App\Core;

use PDO;

final class DB
{
    private static ?PDO $pdo = null;
    
    public static function pdo(): PDO
    {
        if (!self::$pdo) {
            $dsn = sprintf(
                'mysql:host=%s;dbname=%s;charset=utf8mb4',
                Env::get('DB_HOST', 'mysql'),
                Env::get('DB_NAME', 'app')
            );
            self::$pdo = new PDO(
                $dsn,
                Env::get('DB_USER', 'app'),
                Env::get('DB_PASS', 'app'),
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => true,
                ]
            );
        }
        return self::$pdo;
    }
}
