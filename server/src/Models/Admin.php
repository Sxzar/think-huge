<?php

namespace App\Models;

use App\Core\DB;
use PDO;

final class Admin
{
    public static function paginate(int $page = 1, int $limit = 20): array
    {
        $limit = max(1, min($limit, 100));
        $page  = max(1, $page);
        $offset = ($page - 1) * $limit;

        $pdo = DB::pdo();

        $total = (int)$pdo->query('SELECT COUNT(*) FROM admins')->fetchColumn();

        $stmt = $pdo->prepare('SELECT id, email, created_at FROM admins ORDER BY id DESC LIMIT :limit OFFSET :offset');
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll();

        return [
            'data'  => $rows,
            'page'  => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => (int)ceil($total / $limit),
        ];
    }

    public static function findByEmail(string $email): ?array
    {
        $stmt = DB::pdo()->prepare('SELECT * FROM admins WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        $admin = $stmt->fetch();
        return $admin ?: null;
    }

    public static function create(string $email, string $password): int
    {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = DB::pdo()->prepare('INSERT INTO admins (email, password_hash) VALUES (?, ?)');
        $stmt->execute([$email, $hash]);
        return (int)DB::pdo()->lastInsertId();
    }

    public static function update(int $id, string $email, ?string $password = null): bool
    {
        if ($password !== null && $password !== '') {
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = DB::pdo()->prepare('UPDATE admins SET email = ?, password_hash = ? WHERE id = ?');
            $stmt->execute([$email, $hash, $id]);
        } else {
            $stmt = DB::pdo()->prepare('UPDATE admins SET email = ? WHERE id = ?');
            $stmt->execute([$email, $id]);
        }
        return $stmt->rowCount() > 0;
    }

    public static function delete(int $id): bool
    {
        $stmt = DB::pdo()->prepare('DELETE FROM admins WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }
}
