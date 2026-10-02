<?php

namespace Deusy\Controllers;

use Deusy\Database\DB;

class PublicController {
    public static function getSettings(): void {
        $pdo = DB::getConnection();
        $stmt = $pdo->query("SELECT key, value FROM settings");
        $settings = [];
        while ($row = $stmt->fetch()) {
            $settings[$row['key']] = json_decode($row['value'], true);
        }
        echo json_encode(['ok' => true, 'data' => $settings]);
    }

    public static function getServices(?string $kind = null): void {
        $pdo = DB::getConnection();
        if ($kind) {
            $stmt = $pdo->prepare("SELECT * FROM services WHERE active = 1 AND kind = ? ORDER BY sort_order ASC");
            $stmt->execute([$kind]);
        } else {
            $stmt = $pdo->query("SELECT * FROM services WHERE active = 1 ORDER BY sort_order ASC");
        }
        $services = array_map(function($s) {
            $s['scope'] = json_decode($s['scope'], true) ?? [];
            $s['body'] = json_decode($s['body'] ?? '', true);
            return $s;
        }, $stmt->fetchAll());

        echo json_encode(['ok' => true, 'data' => $services]);
    }

    public static function getService(string $slug): void {
        $pdo = DB::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM services WHERE active = 1 AND slug = ? LIMIT 1");
        $stmt->execute([$slug]);
        $s = $stmt->fetch();
        if (!$s) {
            http_response_code(404);
            echo json_encode(['error' => 'Service not found']);
            return;
        }
        $s['scope'] = json_decode($s['scope'], true) ?? [];
        $s['body'] = json_decode($s['body'] ?? '', true);
        echo json_encode(['ok' => true, 'data' => $s]);
    }

    public static function getFaqs(): void {
        $pdo = DB::getConnection();
        $stmt = $pdo->query("SELECT * FROM faqs WHERE active = 1 ORDER BY sort_order ASC");
        echo json_encode(['ok' => true, 'data' => $stmt->fetchAll()]);
    }

    public static function getTeam(): void {
        $pdo = DB::getConnection();
        $stmt = $pdo->query("SELECT * FROM team_members WHERE active = 1 ORDER BY sort_order ASC");
        echo json_encode(['ok' => true, 'data' => $stmt->fetchAll()]);
    }

    public static function getPosts(): void {
        $pdo = DB::getConnection();
        $stmt = $pdo->query("SELECT id, title, slug, excerpt, cover_image, category, author, published_at, created_at FROM posts WHERE published = 1 ORDER BY published_at DESC, created_at DESC");
        echo json_encode(['ok' => true, 'data' => $stmt->fetchAll()]);
    }

    public static function getPost(string $slug): void {
        $pdo = DB::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM posts WHERE published = 1 AND slug = ? LIMIT 1");
        $stmt->execute([$slug]);
        $post = $stmt->fetch();
        if (!$post) {
            http_response_code(404);
            echo json_encode(['error' => 'Article not found']);
            return;
        }
        $post['content'] = json_decode($post['content'], true) ?? [];
        echo json_encode(['ok' => true, 'data' => $post]);
    }

    public static function submitEnquiry(): void {
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true) ?? $_POST;

        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $topic = trim($input['topic'] ?? '');
        $message = trim($input['message'] ?? '');
        $website = trim($input['website'] ?? ''); // Honeypot

        // Honeypot check
        if (!empty($website)) {
            echo json_encode(['ok' => true, 'data' => ['id' => 'bot-rejected']]);
            return;
        }

        // Validation
        $errors = [];
        if (strlen($name) < 2) {
            $errors['name'] = 'Enter your name (at least 2 characters)';
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Enter a valid email address';
        }
        if (strlen($message) < 10) {
            $errors['message'] = 'Your message must be at least 10 characters long';
        }

        if (!empty($errors)) {
            http_response_code(422);
            echo json_encode([
                'ok' => false,
                'error' => 'Validation failed',
                'fieldErrors' => $errors
            ]);
            return;
        }

        $pdo = DB::getConnection();
        $stmt = $pdo->prepare("INSERT INTO enquiries (name, email, phone, topic, message) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $email, $phone ?: null, $topic ?: null, $message]);
        $id = $pdo->lastInsertId();

        echo json_encode([
            'ok' => true,
            'data' => ['id' => $id, 'message' => 'Enquiry submitted successfully']
        ]);
    }
}
