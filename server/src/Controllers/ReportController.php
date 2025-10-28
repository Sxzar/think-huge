<?php
namespace App\Controllers;

use App\Core\{Request, Response};
use App\Models\Reports;

final class ReportController {
    
    // GET /api/reports/summary?client_id=&from=&to=&page=&limit= 

    public static function summary(Request $req) {
        // Parse filters
        $clientId = $req->query('client_id');
        $clientId = ($clientId === null || $clientId === '') ? null : (int)$clientId;

        $from = $req->query('from'); // YYYY-MM-DD or null
        $to = $req->query('to');

        if($from !== null && !isValidDate($from)) {
            return Response::json(['error' => 'Invalid "from" date. Expected format: YYYY-MM-DD'], 422);
        }

        if($to !== null && !isValidDate($to)) {
            return Response::json(['error' => 'Invalid "to" date. Expected format: YYYY-MM-DD'], 422);
        }

        if($from !== null && $to !== null) {
            if(strtotime($from) > strtotime($to)) {
                return Response::json(['error' => '"from" date cannot be later than "to" date'], 422);
            }
        } 

        // Pagination
        $page = (int)$req->query('page', 1);
        $limit = (int)$req->query('limit', 20);
        $page = max(1, $page);
        $limit = max(1, min($limit, 100));
      
        $totals = Reports::totals($clientId, $from, $to);
        $movements = Reports::movements($clientId, $from, $to, $page, $limit);

        $response = [
            'range' => ['from' => $from, 'to' => $to],
            'filters' => array_filter(['client_id' => $clientId], fn($v) => $v !== null),
            'totals' => $totals,
            'movements' => $movements
        ];

        Response::json($response);
    }
}