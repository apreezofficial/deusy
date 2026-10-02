<?php

namespace Deusy\Database;

use PDO;
use PDOException;

class DB {
    private static ?PDO $instance = null;

    public static function getConnection(?string $dbPath = null): PDO {
        if (self::$instance === null || $dbPath !== null) {
            $path = $dbPath ?? __DIR__ . '/../../database/deusy.sqlite';
            $dir = dirname($path);
            if (!is_dir($dir)) {
                mkdir($dir, 0777, true);
            }

            try {
                $pdo = new PDO("sqlite:" . $path);
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                // Enable foreign keys and WAL mode for reliability
                $pdo->exec("PRAGMA foreign_keys = ON;");
                $pdo->exec("PRAGMA journal_mode = WAL;");

                if ($dbPath === null) {
                    self::$instance = $pdo;
                } else {
                    return $pdo;
                }
            } catch (PDOException $e) {
                throw new \RuntimeException("Database connection failed: " . $e->getMessage());
            }
        }

        return self::$instance;
    }

    public static function setConnection(?PDO $pdo): void {
        self::$instance = $pdo;
    }
}
