<?php

namespace App\Models;

use App\Core\DB;
use PDO;

final class Transactions
{
    public static function listByClient(int $clientId, int $page = 1, int $limit = 20): array
    {
        $limit = max(1, min($limit, 100));
        $page = max(1, $page);
        $offset = ($page - 1) * $limit;

        $pdo = DB::pdo();

        $stmtTotal = $pdo->prepare('SELECT COUNT(*) FROM transactions WHERE client_id = ?');
        $stmtTotal->execute([$clientId]);
        $total = (int)$stmtTotal->fetchColumn();

        $stmt = $pdo->prepare(
            'SELECT id, client_id, type, amount, description, occurred_at, created_at
            FROM transactions
            WHERE client_id = ?
            ORDER BY occurred_at DESC, id DESC
            LIMIT ? OFFSET ?'
        );

        $stmt->bindValue(1, $clientId, PDO::PARAM_INT);
        $stmt->bindValue(2, $limit, PDO::PARAM_INT);
        $stmt->bindValue(3, $offset, PDO::PARAM_INT);
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

    public static function create(
        int $clientId,
        string $type,
        float $amount,
        string $occurredAt,
        ?string $description
    ): int {
        $stmt = DB::pdo()->prepare(
            'INSERT INTO transactions (client_id, type, amount, occurred_at, description)
            VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([$clientId, $type, $amount, $occurredAt, $description]);
        return (int)DB::pdo()->lastInsertId();
    }

    public static function update(
        int $id,
        ?string $type = null,
        ?float $amount = null,
        ?string $occurredAt = null,
        ?string $description = null
    ): bool {
        $fields = [];
        $params = [':id' => $id];
        if ($type !== null) {
            $fields[] = 'type = :type';
            $params[':type'] = $type;
        }
        if ($amount !== null) {
            $fields[] = 'amount = :amount';
            $params[':amount'] = $amount;
        }
        if ($occurredAt !== null) {
            $fields[] = 'occurred_at = :occurred_at';
            $params[':occurred_at'] = $occurredAt;
        }
        if ($description !== null) {
            $fields[] = 'description = :description';
            $params[':description'] = $description;
        }

        if (empty($fields)) {
            return false; // nothing to update
        }

        $sql = 'UPDATE transactions SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = DB::pdo()->prepare($sql);
        $stmt->execute($params);

        return $stmt->rowCount() > 0;
    }

    public static function delete(int $id): bool
    {
        $stmt = DB::pdo()->prepare('DELETE FROM transactions WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }
}
