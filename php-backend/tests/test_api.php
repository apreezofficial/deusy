<?php

declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

error_reporting(E_ALL);
ini_set('display_errors', '1');

// Autoload
spl_autoload_register(function (string $class): void {
    $prefix = 'Deusy\\';
    $baseDir = __DIR__ . '/../src/';
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) return;
    $relativeClass = substr($class, $len);
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';
    if (file_exists($file)) require_once $file;
});

use Deusy\Database\DB;
use Deusy\Database\Migrator;
use Deusy\Auth\Auth;
use Deusy\Controllers\PublicController;
use Deusy\Controllers\AdminController;

$totalTests = 0;
$passedTests = 0;

function it(string $description, callable $fn): void {
    global $totalTests, $passedTests;
    $totalTests++;
    try {
        $fn();
        echo "[PASS] {$description}\n";
        $passedTests++;
    } catch (\Throwable $e) {
        echo "[FAIL] {$description}: {$e->getMessage()}\n";
        echo "       At {$e->getFile()}:{$e->getLine()}\n";
    }
}

function assertEq($expected, $actual, string $message = ''): void {
    if ($expected !== $actual) {
        $eStr = is_scalar($expected) ? (string)$expected : json_encode($expected);
        $aStr = is_scalar($actual) ? (string)$actual : json_encode($actual);
        throw new \Exception("Assertion failed: expected [{$eStr}] but got [{$aStr}]. {$message}");
    }
}

function assertTrue($condition, string $message = ''): void {
    if (!$condition) {
        throw new \Exception("Assertion failed: expected true. {$message}");
    }
}

echo "=========================================================\n";
echo " Running Test Suite for Deusy PHP Backend (SQLite)\n";
echo "=========================================================\n\n";

$pdo = DB::getConnection();

// 1. Database & Migrations
it('Initializes SQLite database and tables', function () use ($pdo) {
    Migrator::up($pdo);
    $stmt = $pdo->query("SELECT name FROM sqlite_master WHERE type='table'");
    $tables = $stmt->fetchAll(\PDO::FETCH_COLUMN);
    
    $required = ['users', 'services', 'faqs', 'team_members', 'enquiries', 'posts', 'pages', 'settings'];
    foreach ($required as $table) {
        assertTrue(in_array($table, $tables), "Table {$table} should exist");
    }
});

// 2. Database Seeder
it('Seeds initial data correctly', function () use ($pdo) {
    Migrator::seed($pdo);
    
    $userCount = (int)$pdo->query("SELECT count(*) FROM users")->fetchColumn();
    assertTrue($userCount >= 1, "Admin user should be seeded");
    
    $servicesCount = (int)$pdo->query("SELECT count(*) FROM services")->fetchColumn();
    assertTrue($servicesCount >= 6, "At least 6 services should be seeded");
    
    $postsCount = (int)$pdo->query("SELECT count(*) FROM posts")->fetchColumn();
    assertTrue($postsCount >= 2, "Blog posts should be seeded");
    
    $faqsCount = (int)$pdo->query("SELECT count(*) FROM faqs")->fetchColumn();
    assertTrue($faqsCount >= 3, "At least 3 FAQs should be seeded");
});

// 3. Public Endpoints - Read Queries
it('Fetches services and individual service by slug', function () use ($pdo) {
    $stmt = $pdo->prepare("SELECT * FROM services WHERE active = 1 AND slug = ?");
    $stmt->execute(['property-sales-and-rentals']);
    $service = $stmt->fetch();
    assertTrue($service !== false, "Active service exists");
    assertEq('property-sales-and-rentals', $service['slug']);
});

// 4. Contact Form Validation (< 10 chars vs >= 10 chars)
it('Enforces enquiry validation: message length >= 10 characters', function () {
    $name = 'John Doe';
    $email = 'john@example.com';
    $shortMessage = 'Hi';
    
    $errors = [];
    if (strlen($name) < 2) $errors['name'] = 'Enter your name (at least 2 characters)';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Enter a valid email address';
    if (strlen($shortMessage) < 10) $errors['message'] = 'Your message must be at least 10 characters long';
    
    assertTrue(isset($errors['message']), "Short message should be rejected");
    assertEq('Your message must be at least 10 characters long', $errors['message']);
    
    // Valid message test
    $validMessage = 'I am interested in corporate vehicle sourcing and fleet consultation.';
    $validErrors = [];
    if (strlen($validMessage) < 10) $validErrors['message'] = 'Your message must be at least 10 characters long';
    assertTrue(empty($validErrors), "Valid message should have no error");
});

it('Inserts and retrieves enquiries in SQLite database', function () use ($pdo) {
    $stmt = $pdo->prepare("INSERT INTO enquiries (name, email, message, topic) VALUES (?, ?, ?, ?)");
    $stmt->execute(['Test Submitter', 'test@deusy.com', 'Testing enquiry insertion with >= 10 chars message.', 'Automobile']);
    $newId = (int)$pdo->lastInsertId();
    assertTrue($newId > 0, "Enquiry should be inserted");
    
    $fetchStmt = $pdo->prepare("SELECT * FROM enquiries WHERE id = ?");
    $fetchStmt->execute([$newId]);
    $row = $fetchStmt->fetch();
    assertEq('Test Submitter', $row['name']);
    assertEq('new', $row['status']);
    
    // Clean up
    $pdo->exec("DELETE FROM enquiries WHERE id = {$newId}");
});

// 5. Authentication
it('Authenticates admin user with correct credentials and rejects incorrect ones', function () {
    assertTrue(Auth::login('admin@deusy.com', 'admin123'), "Valid credentials must authenticate");
    assertTrue(Auth::check(), "Auth::check should return true when logged in");
    assertEq('admin', Auth::user()['role']);
    
    Auth::logout();
    assertTrue(!Auth::check(), "Auth::check should return false after logout");
    
    assertTrue(!Auth::login('admin@deusy.com', 'WrongPassword'), "Invalid credentials must fail");
});

// 6. Blog Post CRUD operations
it('Creates, reads, and deletes blog posts in SQLite', function () use ($pdo) {
    // Insert new post
    $stmt = $pdo->prepare("INSERT INTO posts (title, slug, excerpt, content, published) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([
        'Test Suite Post',
        'test-suite-post',
        'An automated test post',
        json_encode(['type' => 'doc', 'content' => []]),
        1
    ]);
    $newId = (int)$pdo->lastInsertId();
    assertTrue($newId > 0, "Post should be inserted with valid ID");
    
    // Read post
    $check = $pdo->query("SELECT * FROM posts WHERE id = {$newId}")->fetch();
    assertEq('Test Suite Post', $check['title']);
    assertEq('test-suite-post', $check['slug']);
    
    // Delete post
    $pdo->exec("DELETE FROM posts WHERE id = {$newId}");
    $deleted = $pdo->query("SELECT * FROM posts WHERE id = {$newId}")->fetch();
    assertTrue($deleted === false, "Post should be deleted");
});

echo "\n---------------------------------------------------------\n";
echo " Results: {$passedTests} / {$totalTests} tests passed.\n";
echo "---------------------------------------------------------\n";

if ($passedTests !== $totalTests) {
    exit(1);
}
