<?php
namespace App\Core;

use App\Core\Response;

final class Guard {
    /**
     * Require an authenticated admin session.
     * Enforce CSRF for non-GET requests.
    */

    public static function requireAdmin(Request $req): void {
        if(!Auth::check()) {
            Response::json(['error' => 'Unauthorized'], 401);
        }

        /** CSRF protection on all non-GET methods */
        $method = $req->method();
        if(in_array($method, ['POST', 'PUT', 'DELETE', 'PATCH'], true))  {
            $csrf = $req->header('X-CSRF-Token');
            if(!Auth::verifyCsrfToken($csrf)) {
                Response::json(['error' => 'CSRF token mismatch'], 419);
            }
        }
    }
}