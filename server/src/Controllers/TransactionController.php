<?php

namespace App\Controllers;

use App\Core\{Request, Response};
use App\Models\Transactions;

final class TransactionController
{
    /** GET /api/clients/{id}/transactions?page=&limit= */
    public static function index(Request $req)
    {
        $path = $req->path();

        if (!preg_match('#^/api/clients/(\d+)/transactions$#', $path, $matches)) {
            return Response::json(['error' => 'Not Found'], 404);
        }

        $clientId = (int)$matches[1];

        $page = (int)($req->query('page', 1));
        $limit = (int)($req->query('limit', 20));

        $result = Transactions::listByClient($clientId, $page, $limit);
        Response::json($result);
    }

    /** POST /api/clients/{id}/transactions */
    public static function store(Request $req)
    {
        $path = $req->path();

        if (!preg_match('#^/api/clients/(\d+)/transactions$#', $path, $matches)) {
            return Response::json(['error' => 'Not Found'], 404);
        }

        $clientId = (int)$matches[1];

        $data = $req->json();
        $type = isset($data['type']) ? (string)$data['type'] : '';
        $amount = isset($data['amount']) ? (float)$data['amount'] : 0.0;
        $occurredAt = isset($data['occurred_at']) ? (string)$data['occurred_at'] : '';
        $description = isset($data['description']) ? trim((string)$data['description']) : null;

        // Validation 
        if (!in_array($type, ['earning', 'expense'], true)) {
            return Response::json(['error' => 'Invalid transaction type'], 422);
        }

        if (!is_finite($amount) || $amount <= 0) {
            return Response::json(['error' => 'Invalid transaction amount'], 422);
        }

        if (!self::isValidDate($occurredAt)) {
            return Response::json(['error' => 'Invalid occurred_at date. Expected format: YYYY-MM-DD'], 422);
        }

        if ($description !== null && mb_strlen($description) > 255) {
            return Response::json(['error' => 'Description too long. Maximum 255 characters allowed'], 422);
        }

        // Create transaction
        try {
            $id = Transactions::create($clientId, $type, $amount, $occurredAt, $description);
        } catch (\Throwable $e) {
            // Likely foreign key violation (client does not exist) or enum/constraint error
            return Response::json(['error' => 'Failed to create transaction. Please check the provided data.'], 422);
        }

        Response::json(['id' => $id], 201);
    }

    /** UPDATE /api/transactions/{id} */
    public static function update(Request $req)
    {
        $path = $req->path();
        if (!preg_match('#^/api/transactions/(\d+)$#', $path, $matches)) {
            return Response::json(['error' => 'Not Found'], 404);
        }
        $id = (int)$matches[1];
        $data = $req->json();

        // Rea optional fields, allow partial update
        $type = array_key_exists('type', $data) ? (string)$data['type'] : null;
        $amount = array_key_exists('amount', $data) ? (float)$data['amount'] : null;
        $occurredAt = array_key_exists('occurred_at', $data) ? (string)$data['occurred_at'] : null;
        $description = array_key_exists('description', $data) ? (string)$data['description'] : null;

        if ($type !== null && !in_array($type, ['earning', 'expense'], true)) {
            return Response::json(['error' => 'Invalid transaction type'], 422);
        }
        if ($amount !== null && (!is_finite($amount) || $amount <= 0)) {
            return Response::json(['error' => 'Invalid transaction amount'], 422);
        }
        if ($occurredAt !== null && !self::isValidDate($occurredAt)) {
            return Response::json(['error' => 'Invalid occurred_at date. Expected format: YYYY-MM-DD'], 422);
        }
        if ($description !== null && mb_strlen($description) > 255) {
            return Response::json(['error' => 'Description too long. Maximum 255 characters allowed'], 422);
        }

        // nothing to update
        if ($type === null && $amount === null && $occurredAt === null && $description === null) {
            return Response::json(['error' => 'No fields to update'], 400);
        }

        $ok = Transactions::update($id, $type, $amount, $occurredAt, $description);
        if (!$ok) {
            // likely not found, or data identical (rowCount = 0). For simplicity we will treat as a 404/not changed.
            return Response::json(['error' => 'Not found or no changes made'], 404);
        }

        Response::json(['ok' => true]);
    }


    /** DELETE /api/transactions/{id} */
    public static function destroy(Request $req)
    {
        $path = $req->path();

        if (!preg_match('#^/api/transactions/(\d+)$#', $path, $matches)) {
            return Response::json(['error' => 'Not Found'], 404);
        }

        $id = (int)$matches[1];

        $ok = Transactions::delete($id);
        if (!$ok) {
            return Response::json(['error' => ' Not Found'], 404);
        }
        Response::json(['ok' => true]);
    }

    private static function isValidDate(string $s): bool
    {
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $s)) return false;
        $dt = \DateTime::createFromFormat('Y-m-d', $s);
        return $dt && $dt->format('Y-m-d') === $s;
    }
}
