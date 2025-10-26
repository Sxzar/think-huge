<?php

namespace App\Models;

use App\Core\DB;
use PDO;

final class Client
{
    public static function paginate(int $page = 1, int $limit = 20): array
    {
        $limit = max(1, min($limit, 100));
        $offset = ($page - 1) * $limit;

        $pdo = DB::pdo();

        $total = (int)$pdo->query('SELECT COUNT(*) FROM clients')->fetchColumn();
        $stmt = $pdo->prepare('SELECT id, name, email, note, created_at FROM clients ORDER BY id DESC LIMIT :limit OFFSET :offset');
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll();

        return [
            'data' => $rows,
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => (int)ceil($total / $limit)
        ];
    }

    public static function find(int $id): ?array
    {
        $stmt = DB::pdo()->prepare('SELECT id, name, email, note, created_at FROM clients WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function create(string $name, ?string $email, ?string $note): int
    {
        $stmt = DB::pdo()->prepare('INSERT INTO clients (name, email, note) VALUES (?, ?, ?)');
        $stmt->execute([$name, $email, $note]);
        return (int)DB::pdo()->lastInsertId();
    }

    public static function update(int $id, string $name, ?string $email, ?string $note): bool
    {
        $stmt = DB::pdo()->prepare('UPDATE clients SET name = ?, email = ?, note = ? WHERE id = ?');
        $stmt->execute([$name, $email, $note, $id]);
        return $stmt->rowCount() > 0;
    }

    public static function delete(int $id): bool
    {
        $stmt = DB::pdo()->prepare('DELETE FROM clients WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }
}
