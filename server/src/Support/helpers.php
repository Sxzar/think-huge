<?php 
function basePath (string $path = ''): string {
    return __DIR__ . '/../' . ltrim($path, '/');
}

/**
 * 
 * Check if a date string is valid in YYYY-MM-DD format
 * 
 * 
 * @param string $s
 * @return bool
 * 
 */

function isValidDate(string $s): bool
{
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $s)) {
        return false;
    }
    $dt = DateTime::createFromFormat('Y-m-d', $s);
    return $dt && $dt->format('Y-m-d') === $s;
}