<?php
namespace App\Core;

final class Request {
    public function method(): string {
        return $_SERVER['REQUEST_METHOD'] ?? 'GET';
    }
    public function path(): string {
        return parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
    }
    public function header(string $name): ?string {
        $key = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
        return $_SERVER[$key] ?? null;
    }
    
    public function query(string $key, $default = null) {
        return $_GET[$key] ?? $default;
    }

    public function json(): array {
        $raw = file_get_contents('php://input');
        if($raw === '' || $raw === false) return [];
        $data= json_decode($raw, true);
        if(json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
            return [];
        }
        return $data;
    }
}