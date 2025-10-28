<?php

namespace App\Models;

use App\Core\DB;
use PDO;

final class Reports
{
    /**
     *  Compute totals for optional client/date range 
     */

    public static function totals(?int $clientId, ?string $from, ?string $to): array
    {
        $pdo = DB::pdo();

        [$where, $params] = self::buildWhere($clientId, $from, $to);

        $sql = "
            SELECT
            COALESCE(SUM(CASE WHEN type = 'earning' THEN amount END), 0) AS earnings,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN AMOUNT END), 0) AS expenses
            FROM transactions
            $where
         ";

        $stmt = $pdo->prepare($sql);

        foreach ($params as $key => $value) $stmt->bindValue($key, $value);
        $stmt->execute();
        $row = $stmt->fetch() ?: ['earnings' => 0, 'expenses' => 0];

        $earnings = (float)$row['earnings'];
        $expenses = (float)$row['expenses'];
        $balance = $earnings - $expenses;

        return [
            'earnings' => $earnings,
            'expenses' => $expenses,
            'balance'  => $balance
        ];
    }

    /** 
     *  Return a paginated list of transactions with an optional client
     *  and/or date range. Also include the total number of matching transactions
     *  so the frontend can display pagination controls
     */

    public static function movements(?int $clientId, ?string $from, ?string $to, int $page = 1, int $limit = 20): array
    {
        $limit = max(1, min($limit, 100));
        $page = max(1, $page);
        $offset = ($page - 1) * $limit;

        $pdo = DB::pdo();
        [$where, $params] = self::buildWhere($clientId, $from, $to);

        // total
        $stmtTotal = $pdo->prepare("SELECT COUNT(*) FROM transactions $where");

        foreach ($params as $key => $value) $stmtTotal->bindValue($key, $value);
        $stmtTotal->execute();
        $total = (int)$stmtTotal->fetchColumn();

        // rows
        $sql = "
            SELECT id, client_id, type, amount, description, occurred_at, created_at
            FROM transactions
            $where
            ORDER BY occurred_at DESC, id DESC
            LIMIT :limit OFFSET :offset
        ";

        $stmt = $pdo->prepare($sql);

        foreach ($params as $key => $value) $stmt->bindValue($key, $value);

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

    /**
     * Helper to build dynamic SQL WHERE clause and its parameters
     * Retruns both the WHERE sting and the params array for prepared statements
     */
    public static function buildWhere(?int $clientId, ?string $from, ?string $to): array
    {
        $parts = [];
        $params = [];

        if ($clientId !== null) {
            $parts[] = 'client_id = :client_id';
            $params[':client_id'] = $clientId;
        }

        if ($from !== null) {
            $parts[] = 'occurred_at >= :from';
            $params[':from'] = $from; // YYYY-MM-DD
        }

        if ($to !== null) {
            $parts[] = 'occurred_at <= :to';
            $params[':to'] = $to; // YYYY-MM-DD
        }

        $where = $parts ? ('WHERE ' . implode(' AND ', $parts)) : '';
        return [$where, $params];
    }
}
