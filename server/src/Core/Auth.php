<?php
namespace App\Core;

use App\Core\DB;

final class Auth {
    private static function bootSession(): void {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            // Start the session if it hasn't been started yet
            session_start();
        }
    }

    public static function attempt(string $email, string $password): ?array {
        $pdo = DB::pdo();
        $stmt = $pdo->prepare('SELECT id, email, password_hash FROM admins WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        $row = $stmt->fetch();
        
        if(!$row) return null;

        if(!password_verify($password, $row['password_hash'])) {
            return null;
        }

        return [
            'id' => (int)$row['id'],
            'email' => $row['email']
        ];
    }

    public static function login(int $adminId, string $email): void {
        self::bootSession();

        session_regenerate_id(true); // Prevent session fixation
        
        $_SESSION['admin_id'] = $adminId;
        $_SESSION['admin_email'] = $email;

        // Generate CSRF token if missing
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
    }

    public static function logout(): void {
        self::bootSession();

        $_SESSION = [];

        if(ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'] ?? false, $params['httponly'] ?? true);
        }
        session_destroy();
    }

    public static function check(): bool {
        self::bootSession();
        return isset($_SESSION['admin_id']);
    }

    public static function id(): ?int {
        self::bootSession();
        return isset($_SESSION['admin_id']) ? (int)$_SESSION['admin_id'] : null;
    }

    public static function user(): ?array {
        self::bootSession();
        if(!isset($_SESSION['admin_id'])) return null;
        return [
            'id' => (int)$_SESSION['admin_id'],
            'email' => (string)$_SESSION['admin_email']
        ];
    }

    public static function csrfToken(): string {
        self::bootSession();
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    public static function verifyCsrfToken(?string $token): bool {
        self::bootSession();
        $sessionToken = $_SESSION['csrf_token'] ?? '';
        // constant time comparison to prevent timing attacks
        return is_string($token) && is_string($sessionToken) && hash_equals($sessionToken, $token);
    }
 }