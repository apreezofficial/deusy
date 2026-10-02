# Deusy Investments Services — Vanilla PHP & SQLite Backend

A lightweight, zero-dependency, ultra-fast backend written in **Vanilla PHP 8.x** and powered by **SQLite** with Write-Ahead Logging (WAL) enabled. Built specifically for **Deusy Investments Services**, this backend provides a full REST API for services, team members, FAQs, enquiries (with bot protection & message length validation), blog posts, custom pages, and secure administrative operations.

---

## Architecture & Directory Structure

```
php-backend/
├── config/
│   └── database.php           # Database configuration constants & settings
├── database/
│   └── deusy.sqlite           # SQLite file (auto-created with WAL mode & foreign keys)
├── public/
│   └── index.php              # Front controller, CORS handler, routing dispatcher
├── src/
│   ├── Auth/
│   │   └── Auth.php           # Session-based auth with password_verify & bcrypt
│   ├── Controllers/
│   │   ├── AdminController.php  # Protected CRUD for posts, services, faqs, enquiries
│   │   └── PublicController.php # Public endpoints, enquiries with >=10 char validation
│   └── Database/
│       ├── DB.php             # Thread-safe PDO SQLite singleton
│       └── Migrator.php       # Schema migrations & initial seeders
├── tests/
│   └── test_api.php           # Automated test suite
└── README.md                  # This documentation
```

---

## Requirements

- **PHP 8.1+** (CLI or Web Server)
- **PDO SQLite extension** (`pdo_sqlite` enabled in `php.ini`)
- No Composer or external third-party dependencies required.

---

## Quick Start / Running the Backend

### 1. Built-in PHP Development Server
To start the API on `http://localhost:8000`:

```bash
cd php-backend
php -S localhost:8000 -t public
```

### 2. Auto-Migration & Seeding
The backend automatically creates the SQLite database file and tables on first request, pre-populating:
- **Admin account**:
  - **Email**: `admin@deusy.com`
  - **Password**: `admin123`
- **6 Practices & Agency Services**:
  - Construction and real estate
  - Human resources management
  - Business consultancy
  - Property sales, rentals and agency
  - Automobile sales and agency
  - General agency and business facilitation
- **Leadership team members**
- **Default FAQs**
- **Blog posts**
- **Site configuration settings**

---

## Running the Automated Test Suite

Run the comprehensive test script directly from your terminal:

```bash
cd php-backend
php tests/test_api.php
```

### Test Coverage:
1. `Initializes SQLite database and tables` (verifies all schema tables)
2. `Seeds initial data correctly` (verifies admin user, services, posts, FAQs)
3. `Fetches services and individual service by slug`
4. `Enforces enquiry validation: message length >= 10 characters` (rejects `< 10` chars, accepts `>= 10` chars)
5. `Inserts and retrieves enquiries in SQLite database`
6. `Authenticates admin user with correct credentials and rejects incorrect ones`
7. `Creates, reads, and deletes blog posts in SQLite`

---

## API Endpoints Reference

### Public API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` or `/api` | API health check & version info |
| `GET` | `/api/settings` | Returns site branding, contact details, hero content |
| `GET` | `/api/services` | Lists all active services (filter with `?kind=practice` or `?kind=agency`) |
| `GET` | `/api/services/{slug}` | Returns service details by slug |
| `GET` | `/api/team` | Lists active team members |
| `GET` | `/api/faqs` | Lists active frequently asked questions |
| `GET` | `/api/posts` | Lists all published blog posts |
| `GET` | `/api/posts/{slug}` | Returns a single blog post by slug |
| `POST` | `/api/enquiries` | Submit contact enquiry (requires `>= 10` characters message) |

#### Enquiry Payload Example (`POST /api/enquiries`):
```json
{
  "name": "Kwame Mensah",
  "email": "kwame@example.com",
  "phone": "+233 24 000 0000",
  "topic": "Property sales, rentals and agency",
  "message": "I would like to inquire about commercial property availability in Accra."
}
```
*Note: If `message` is fewer than 10 characters, the API responds with HTTP 422: `{"ok": false, "error": "Validation failed", "fieldErrors": {"message": "Your message must be at least 10 characters long"}}`.*

---

### Admin API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Login with email and password (returns session cookie) |
| `POST` | `/api/admin/logout` | Clears current session |
| `GET` | `/api/admin/me` | Returns currently logged-in admin profile |
| `GET` | `/api/admin/posts` | List all blog posts (published and drafts) |
| `GET` | `/api/admin/posts/{id}` | Get post by ID |
| `POST` | `/api/admin/posts` | Create or update a post |
| `DELETE` | `/api/admin/posts/{id}` | Delete a post |
| `GET` | `/api/admin/enquiries` | View all customer enquiries |
| `PATCH` | `/api/admin/enquiries/{id}/status` | Update enquiry status (`new`, `read`, `archived`) |
| `DELETE` | `/api/admin/enquiries/{id}` | Delete an enquiry |
| `POST` | `/api/admin/faqs` | Create or update FAQ |
| `DELETE` | `/api/admin/faqs/{id}` | Delete FAQ |
| `POST` | `/api/admin/services` | Create or update service item |
