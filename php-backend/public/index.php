<?php

declare(strict_types=1);

// Set error handling
error_reporting(E_ALL);
ini_set('display_errors', '0');

// Autoloader for classes in src/
spl_autoload_register(function (string $class): void {
    $prefix = 'Deusy\\';
    $baseDir = __DIR__ . '/../src/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relativeClass = substr($class, $len);
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

    if (file_exists($file)) {
        require_once $file;
    }
});

use Deusy\Database\DB;
use Deusy\Database\Migrator;
use Deusy\Auth\Auth;
use Deusy\Controllers\PublicController;
use Deusy\Controllers\AdminController;

// Handle CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: {$origin}");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Ensure database tables and initial seed data exist
try {
    $pdo = DB::getConnection();
    Migrator::up($pdo);
    Migrator::seed($pdo);
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database initialization failed: ' . $e->getMessage()]);
    exit;
}

// Parse request path
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
if ($uri !== '/' && str_ends_with($uri, '/')) {
    $uri = rtrim($uri, '/');
}

// Strip subdirectories if hosted under /php-backend or /public
$scriptDir = dirname($_SERVER['SCRIPT_NAME'] ?? '');
if ($scriptDir !== '/' && $scriptDir !== '\\' && str_starts_with($uri, $scriptDir)) {
    $uri = substr($uri, strlen($scriptDir)) ?: '/';
}

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

// -----------------------------------------------------------------------------
// Public Routes
// -----------------------------------------------------------------------------
if ($method === 'GET' && ($uri === '' || $uri === '/' || $uri === '/api')) {
    echo json_encode([
        'name' => 'Deusy Investments API',
        'status' => 'online',
        'version' => '1.0.0',
        'engine' => 'Vanilla PHP ' . PHP_VERSION . ' + SQLite'
    ]);
    exit;
}

if ($method === 'GET' && $uri === '/api/settings') {
    PublicController::getSettings();
    exit;
}

if ($method === 'GET' && $uri === '/api/services') {
    PublicController::getServices($_GET['kind'] ?? null);
    exit;
}

if ($method === 'GET' && preg_match('#^/api/services/([a-zA-Z0-9_-]+)$#', $uri, $matches)) {
    PublicController::getService($matches[1]);
    exit;
}

if ($method === 'GET' && $uri === '/api/faqs') {
    PublicController::getFaqs();
    exit;
}

if ($method === 'GET' && $uri === '/api/team') {
    PublicController::getTeam();
    exit;
}

if ($method === 'GET' && $uri === '/api/posts') {
    PublicController::getPosts();
    exit;
}

if ($method === 'GET' && preg_match('#^/api/posts/([a-zA-Z0-9_-]+)$#', $uri, $matches)) {
    PublicController::getPost($matches[1]);
    exit;
}

if ($method === 'POST' && $uri === '/api/enquiries') {
    PublicController::submitEnquiry();
    exit;
}

// -----------------------------------------------------------------------------
// Auth Routes
// -----------------------------------------------------------------------------
if ($method === 'POST' && $uri === '/api/admin/login') {
    AdminController::login();
    exit;
}

if ($method === 'POST' && $uri === '/api/admin/logout') {
    AdminController::logout();
    exit;
}

if ($method === 'GET' && $uri === '/api/admin/me') {
    AdminController::me();
    exit;
}

// -----------------------------------------------------------------------------
// Admin CRUD Routes
// -----------------------------------------------------------------------------
// Posts
if ($method === 'GET' && $uri === '/api/admin/posts') {
    AdminController::getPosts();
    exit;
}

if ($method === 'GET' && preg_match('#^/api/admin/posts/(\d+)$#', $uri, $matches)) {
    AdminController::getPost((int)$matches[1]);
    exit;
}

if ($method === 'POST' && $uri === '/api/admin/posts') {
    AdminController::savePost();
    exit;
}

if ($method === 'DELETE' && preg_match('#^/api/admin/posts/(\d+)$#', $uri, $matches)) {
    AdminController::deletePost((int)$matches[1]);
    exit;
}

// Enquiries
if ($method === 'GET' && $uri === '/api/admin/enquiries') {
    AdminController::getEnquiries();
    exit;
}

if ($method === 'PATCH' && preg_match('#^/api/admin/enquiries/(\d+)/status$#', $uri, $matches)) {
    AdminController::updateEnquiryStatus((int)$matches[1]);
    exit;
}

if ($method === 'DELETE' && preg_match('#^/api/admin/enquiries/(\d+)$#', $uri, $matches)) {
    AdminController::deleteEnquiry((int)$matches[1]);
    exit;
}

// FAQs
if ($method === 'POST' && $uri === '/api/admin/faqs') {
    AdminController::saveFaq();
    exit;
}

if ($method === 'DELETE' && preg_match('#^/api/admin/faqs/(\d+)$#', $uri, $matches)) {
    AdminController::deleteFaq((int)$matches[1]);
    exit;
}

// Services
if ($method === 'POST' && $uri === '/api/admin/services') {
    AdminController::saveService();
    exit;
}

// 404 Fallback
http_response_code(404);
echo json_encode([
    'error' => 'Endpoint not found',
    'method' => $method,
    'uri' => $uri
]);
