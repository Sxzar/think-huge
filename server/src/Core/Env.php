<?php
namespace App\Core;

final class Env {
    public static function get(string $key, ?string $default = null): ?string {
        $value = getenv($key);
        return $value === false ? $default : $value;
    }
}