<?php

namespace Deusy\Auth;

use Deusy\Database\DB;

class Auth {
    public static function initSession(): void {
        if (session_status() === PHP_SESSION_NONE && !headers_sent()) {
            session_start();
        }
    }

    public static function login(string $email, string $password): ?array {
        self::initSession();
        $pdo = DB::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([trim($email)]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            $token = bin2hex(random_bytes(32));
            try {
                $upd = $pdo->prepare("UPDATE users SET api_token = ? WHERE id = ?");
                $upd->execute([$token, $user['id']]);
            } catch (\Throwable $e) {
                // In case api_token column hasn't migrated yet
            }

            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_name'] = $user['full_name'];
            $_SESSION['user_role'] = $user['role'];
            $_SESSION['api_token'] = $token;

            return [
                'id' => (string)$user['id'],
                'email' => $user['email'],
                'name' => $user['full_name'],
                'role' => $user['role'],
                'token' => $token,
            ];
        }

        return null;
    }

    public static function logout(): void {
        self::initSession();
        $_SESSION = [];
        if (ini_get("session.use_cookies") && !headers_sent()) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
    }

    public static function check(): bool {
        return self::user() !== null;
    }

    public static function user(): ?array {
        // 1. Check Bearer token from header
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s+(\S+)/i', $authHeader, $matches)) {
            $token = $matches[1];
            try {
                $pdo = DB::getConnection();
                $stmt = $pdo->prepare("SELECT id, email, full_name, role FROM users WHERE api_token = ? LIMIT 1");
                $stmt->execute([$token]);
                $u = $stmt->fetch();
                if ($u) {
                    return [
                        'id' => (string)$u['id'],
                        'email' => $u['email'],
                        'name' => $u['full_name'],
                        'role' => $u['role'],
                    ];
                }
            } catch (\Throwable $e) {}
        }

        // 2. Check session
        self::initSession();
        if (isset($_SESSION['user_id'])) {
            return [
                'id' => (string)$_SESSION['user_id'],
                'email' => $_SESSION['user_email'],
                'name' => $_SESSION['user_name'],
                'role' => $_SESSION['user_role'],
            ];
        }

        return null;
    }

    public static function requireAuth(): array {
        $user = self::user();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit;
        }
        return $user;
    }
}
