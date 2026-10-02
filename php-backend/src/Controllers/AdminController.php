<?php

namespace Deusy\Controllers;

use Deusy\Auth\Auth;
use Deusy\Database\DB;

class AdminController {
    public static function login(): void {
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true) ?? $_POST;

        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        if (Auth::login($email, $password)) {
            echo json_encode([
                'ok' => true,
                'data' => Auth::user()
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                'ok' => false,
                'error' => 'Invalid email or password'
            ]);
        }
    }

    public static function logout(): void {
        Auth::logout();
        echo json_encode(['ok' => true, 'message' => 'Logged out successfully']);
    }

    public static function me(): void {
        $user = Auth::requireAuth();
        echo json_encode(['ok' => true, 'data' => $user]);
    }

    // --- ENQUIRIES ---
    public static function getEnquiries(): void {
        Auth::requireAuth();
        $pdo = DB::getConnection();
        $status = $_GET['status'] ?? null;
        if ($status && in_array($status, ['new', 'read', 'archived'])) {
            $stmt = $pdo->prepare("SELECT * FROM enquiries WHERE status = ? ORDER BY created_at DESC");
            $stmt->execute([$status]);
        } else {
            $stmt = $pdo->query("SELECT * FROM enquiries ORDER BY created_at DESC");
        }
        echo json_encode(['ok' => true, 'data' => $stmt->fetchAll()]);
    }

    public static function updateEnquiryStatus(int $id): void {
        Auth::requireAuth();
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true) ?? $_POST;
        $status = $input['status'] ?? 'read';

        $pdo = DB::getConnection();
        $stmt = $pdo->prepare("UPDATE enquiries SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);
        echo json_encode(['ok' => true, 'data' => ['id' => $id, 'status' => $status]]);
    }

    public static function deleteEnquiry(int $id): void {
        Auth::requireAuth();
        $pdo = DB::getConnection();
        $stmt = $pdo->prepare("DELETE FROM enquiries WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['ok' => true, 'data' => ['deleted' => true]]);
    }

    // --- POSTS (BLOG) ---
    public static function getPosts(): void {
        Auth::requireAuth();
        $pdo = DB::getConnection();
        $stmt = $pdo->query("SELECT * FROM posts ORDER BY created_at DESC");
        $posts = array_map(function($p) {
            $p['content'] = json_decode($p['content'], true) ?? [];
            return $p;
        }, $stmt->fetchAll());
        echo json_encode(['ok' => true, 'data' => $posts]);
    }

    public static function getPost(int $id): void {
        Auth::requireAuth();
        $pdo = DB::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM posts WHERE id = ?");
        $stmt->execute([$id]);
        $p = $stmt->fetch();
        if (!$p) {
            http_response_code(404);
            echo json_encode(['error' => 'Post not found']);
            return;
        }
        $p['content'] = json_decode($p['content'], true) ?? [];
        echo json_encode(['ok' => true, 'data' => $p]);
    }

    public static function savePost(): void {
        Auth::requireAuth();
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true) ?? $_POST;

        $id = !empty($input['id']) ? (int)$input['id'] : null;
        $title = trim($input['title'] ?? '');
        $slug = trim($input['slug'] ?? '');
        $excerpt = trim($input['excerpt'] ?? '');
        $category = trim($input['category'] ?? 'General');
        $author = trim($input['author'] ?? 'Deusy Team');
        $coverImage = trim($input['cover_image'] ?? '');
        $content = isset($input['content']) ? (is_string($input['content']) ? $input['content'] : json_encode($input['content'])) : '{"type":"doc","content":[]}';
        $published = !empty($input['published']) ? 1 : 0;
        $publishedAt = $published ? date('Y-m-d H:i:s') : null;

        if (empty($title) || empty($slug)) {
            http_response_code(422);
            echo json_encode(['ok' => false, 'error' => 'Title and slug are required']);
            return;
        }

        $pdo = DB::getConnection();

        // Check unique slug
        if ($id) {
            $chk = $pdo->prepare("SELECT id FROM posts WHERE slug = ? AND id != ?");
            $chk->execute([$slug, $id]);
        } else {
            $chk = $pdo->prepare("SELECT id FROM posts WHERE slug = ?");
            $chk->execute([$slug]);
        }
        if ($chk->fetch()) {
            http_response_code(422);
            echo json_encode(['ok' => false, 'error' => "Slug '$slug' is already in use"]);
            return;
        }

        if ($id) {
            $stmt = $pdo->prepare("
                UPDATE posts 
                SET title = ?, slug = ?, excerpt = ?, category = ?, author = ?, cover_image = ?, content = ?, published = ?, published_at = COALESCE(published_at, ?), updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ");
            $stmt->execute([$title, $slug, $excerpt, $category, $author, $coverImage, $content, $published, $publishedAt, $id]);
            echo json_encode(['ok' => true, 'data' => ['id' => $id, 'slug' => $slug, 'published' => $published]]);
        } else {
            $stmt = $pdo->prepare("
                INSERT INTO posts (title, slug, excerpt, category, author, cover_image, content, published, published_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([$title, $slug, $excerpt, $category, $author, $coverImage, $content, $published, $publishedAt]);
            $newId = $pdo->lastInsertId();
            echo json_encode(['ok' => true, 'data' => ['id' => $newId, 'slug' => $slug, 'published' => $published]]);
        }
    }

    public static function deletePost(int $id): void {
        Auth::requireAuth();
        $pdo = DB::getConnection();
        $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['ok' => true, 'data' => ['deleted' => true]]);
    }

    // --- FAQS ---
    public static function saveFaq(): void {
        Auth::requireAuth();
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true) ?? $_POST;
        $id = !empty($input['id']) ? (int)$input['id'] : null;
        $question = trim($input['question'] ?? '');
        $answer = trim($input['answer'] ?? '');
        $sortOrder = (int)($input['sort_order'] ?? 0);
        $active = isset($input['active']) ? (int)$input['active'] : 1;

        $pdo = DB::getConnection();
        if ($id) {
            $stmt = $pdo->prepare("UPDATE faqs SET question = ?, answer = ?, sort_order = ?, active = ? WHERE id = ?");
            $stmt->execute([$question, $answer, $sortOrder, $active, $id]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO faqs (question, answer, sort_order, active) VALUES (?, ?, ?, ?)");
            $stmt->execute([$question, $answer, $sortOrder, $active]);
            $id = $pdo->lastInsertId();
        }
        echo json_encode(['ok' => true, 'data' => ['id' => $id]]);
    }

    public static function deleteFaq(int $id): void {
        Auth::requireAuth();
        $pdo = DB::getConnection();
        $stmt = $pdo->prepare("DELETE FROM faqs WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['ok' => true, 'data' => ['deleted' => true]]);
    }

    // --- SERVICES ---
    public static function saveService(): void {
        Auth::requireAuth();
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true) ?? $_POST;
        $id = !empty($input['id']) ? (int)$input['id'] : null;
        $kind = $input['kind'] ?? 'practice';
        $title = trim($input['title'] ?? '');
        $slug = trim($input['slug'] ?? '');
        $summary = trim($input['summary'] ?? '');
        $scope = is_array($input['scope'] ?? null) ? json_encode($input['scope']) : '[]';
        $image = trim($input['image'] ?? '');
        $sortOrder = (int)($input['sort_order'] ?? 0);
        $active = isset($input['active']) ? (int)$input['active'] : 1;

        $pdo = DB::getConnection();
        if ($id) {
            $stmt = $pdo->prepare("
                UPDATE services 
                SET kind = ?, title = ?, slug = ?, summary = ?, scope = ?, image = ?, sort_order = ?, active = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ");
            $stmt->execute([$kind, $title, $slug, $summary, $scope, $image, $sortOrder, $active, $id]);
        } else {
            $stmt = $pdo->prepare("
                INSERT INTO services (kind, title, slug, summary, scope, image, sort_order, active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([$kind, $title, $slug, $summary, $scope, $image, $sortOrder, $active]);
            $id = $pdo->lastInsertId();
        }
        echo json_encode(['ok' => true, 'data' => ['id' => $id]]);
    }
}
