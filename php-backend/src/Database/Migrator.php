<?php

namespace Deusy\Database;

use PDO;

class Migrator {
    public static function up(PDO $pdo): void {
        // 1. Users/Admins table
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                full_name TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'editor',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ");

        // 2. Services table
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS services (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                kind TEXT NOT NULL CHECK (kind IN ('practice', 'agency')),
                title TEXT NOT NULL,
                slug TEXT NOT NULL UNIQUE,
                summary TEXT NOT NULL,
                scope TEXT NOT NULL DEFAULT '[]', -- JSON array
                body TEXT,                        -- JSON doc
                image TEXT,
                sort_order INTEGER NOT NULL DEFAULT 0,
                active INTEGER NOT NULL DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ");

        // 3. FAQs table
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS faqs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                sort_order INTEGER NOT NULL DEFAULT 0,
                active INTEGER NOT NULL DEFAULT 1
            );
        ");

        // 4. Team Members table
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS team_members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                slug TEXT UNIQUE,
                role TEXT NOT NULL,
                summary TEXT,
                bio TEXT,
                photo TEXT,
                sort_order INTEGER NOT NULL DEFAULT 0,
                active INTEGER NOT NULL DEFAULT 1
            );
        ");

        // 5. Contact Enquiries table
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS enquiries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                topic TEXT,
                message TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ");

        // 6. Blog Posts table
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                slug TEXT NOT NULL UNIQUE,
                excerpt TEXT,
                content TEXT NOT NULL DEFAULT '{\"type\":\"doc\",\"content\":[]}', -- JSON doc
                cover_image TEXT,
                category TEXT,
                author TEXT,
                published INTEGER NOT NULL DEFAULT 0,
                published_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ");

        // 7. Pages table (custom / extra pages)
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS pages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                slug TEXT NOT NULL UNIQUE,
                subtitle TEXT,
                template TEXT NOT NULL DEFAULT 'standard',
                content TEXT NOT NULL DEFAULT '{\"type\":\"doc\",\"content\":[]}',
                published INTEGER NOT NULL DEFAULT 0,
                show_in_nav INTEGER NOT NULL DEFAULT 0,
                nav_label TEXT,
                nav_order INTEGER NOT NULL DEFAULT 0,
                seo_title TEXT,
                seo_desc TEXT,
                og_image TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ");

        // 8. Settings table
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL -- JSON
            );
        ");

        // 9. Media library table
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS media (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL,
                path TEXT NOT NULL UNIQUE,
                url TEXT NOT NULL,
                alt TEXT,
                size_bytes INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ");
    }

    public static function seed(PDO $pdo): void {
        // Seed initial admin user: admin@deusy.com / admin123
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
        $stmt->execute(['admin@deusy.com']);
        if ($stmt->fetchColumn() == 0) {
            $passHash = password_hash('admin123', PASSWORD_BCRYPT);
            $ins = $pdo->prepare("INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, 'admin')");
            $ins->execute(['admin@deusy.com', $passHash, 'Deusy Administrator']);
        }

        // Seed site settings
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM settings WHERE key = ?");
        $stmt->execute(['site']);
        if ($stmt->fetchColumn() == 0) {
            $siteSettings = json_encode([
                'name' => 'Deusy Investments Services',
                'tagline' => 'Building people. Planning solutions. Creating value.',
                'phone' => '+233 24 123 4567',
                'email' => 'info@deusy.com',
                'addressLines' => [
                    'Pantang Shalom Junction, Accra, Ghana',
                    'P.O. Box AF 1921, Adenta, Ghana'
                ],
                'hours' => 'Mon – Fri: 8:00 AM – 5:00 PM',
                'socials' => []
            ]);
            $ins = $pdo->prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
            $ins->execute(['site', $siteSettings]);
        }

        // Seed home settings
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM settings WHERE key = ?");
        $stmt->execute(['home']);
        if ($stmt->fetchColumn() == 0) {
            $homeSettings = json_encode([
                'heroTitle' => 'We build people, plan solutions and create value.',
                'heroIntro' => 'Construction and real estate, human resources management, business consultancy, and agency services for individuals, businesses, institutions and organisations across Ghana.',
                'servicesHeading' => 'Three practices, one accountable team.',
                'agencyHeading' => 'Property, vehicles and business facilitation, handled by people who keep the paperwork moving.',
                'closingHeading' => 'Tell us what you are planning.'
            ]);
            $ins = $pdo->prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
            $ins->execute(['home', $homeSettings]);
        }

        // Seed default services
        $stmt = $pdo->query("SELECT COUNT(*) FROM services");
        if ($stmt->fetchColumn() == 0) {
            $services = [
                [
                    'practice',
                    'Construction and real estate',
                    'construction-and-real-estate',
                    'Building and construction services, project planning and coordination, property development and management support, real estate consultancy and project supervision.',
                    json_encode(['Building and construction services', 'Project planning and coordination', 'Property development support', 'Project supervision']),
                    '/images/practice-construction.jpg',
                    1
                ],
                [
                    'practice',
                    'Human resources management',
                    'human-resources-management',
                    'Recruitment, employee management, HR policies, staff training, performance management and workplace relations support for organisations.',
                    json_encode(['Recruitment and staffing support', 'Employee management', 'HR policies and procedures', 'HR compliance support']),
                    '/images/practice-hr.jpg',
                    2
                ],
                [
                    'practice',
                    'Consultancy',
                    'consultancy',
                    'Training, inspection readiness and labour compliance, plus budgeting, finance, human resources and general business advisory.',
                    json_encode(['Labour compliance advisory', 'Inspection-readiness training', 'Workplace documentation', 'Business growth strategies']),
                    '/images/practice-consultancy.jpg',
                    3
                ],
                [
                    'agency',
                    'Property sales, rentals and agency',
                    'property-sales-and-rentals',
                    'Professional property agency and brokerage for clients looking to buy, sell, rent or manage land, houses, commercial property, apartments and rooms.',
                    json_encode(['Land sales and acquisition support', 'Houses for sale and rent', 'Commercial property', 'Apartments and rooms']),
                    '/images/agency-property.jpg',
                    4
                ],
                [
                    'agency',
                    'Automobile sales and agency',
                    'automobile-sales-and-agency',
                    'Cars, vehicle sourcing and buyer and seller agency for individuals and businesses, including corporate and personal vehicle sourcing.',
                    json_encode(['Cars for sale', 'Vehicle sourcing', 'Buyer and seller agency', 'Inspection and documentation support']),
                    '/images/agency-automobile.jpg',
                    5
                ],
                [
                    'agency',
                    'General agency and business facilitation',
                    'general-agency-and-business-facilitation',
                    'Connecting clients with suitable contractors, professionals, suppliers and business opportunities, with proper coordination from start to finish.',
                    json_encode(['Contractor sourcing', 'Professional referrals', 'Supplier connections', 'Business opportunities']),
                    '/images/agency-facilitation.jpg',
                    6
                ]
            ];

            $ins = $pdo->prepare("INSERT INTO services (kind, title, slug, summary, scope, image, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)");
            foreach ($services as $srv) {
                $ins->execute($srv);
            }
        }

        // Seed default team members
        $stmt = $pdo->query("SELECT COUNT(*) FROM team_members");
        if ($stmt->fetchColumn() == 0) {
            $team = [
                [
                    'Eric Semanu-Uzziah Dornyo',
                    'eric-semanu-uzziah-dornyo',
                    'Managing Director',
                    'Entrepreneur and business development consultant with over 20 years across banking, microfinance, real estate and strategic planning.',
                    '/images/profile-2.jpg',
                    1
                ],
                [
                    'Raphael Cameron Etse',
                    'raphael-cameron-etse',
                    'Finance, Administration and Operations Manager',
                    'Finance and administration leader with 20+ years across United Nations operations and private sector management in Ghana.',
                    '/images/profile-1.jpg',
                    2
                ]
            ];
            $ins = $pdo->prepare("INSERT INTO team_members (name, slug, role, summary, photo, sort_order) VALUES (?, ?, ?, ?, ?, ?)");
            foreach ($team as $member) {
                $ins->execute($member);
            }
        }

        // Seed default FAQs
        $stmt = $pdo->query("SELECT COUNT(*) FROM faqs");
        if ($stmt->fetchColumn() == 0) {
            $faqs = [
                ['Where is Deusy Investments Services located in Ghana?', 'We are located at Pantang Shalom Junction, Accra, Ghana. We handle projects and operations nationwide.', 1],
                ['How do you handle construction project coordination?', 'We establish a clear written scope, milestone schedules, contractor oversight, procurement tracking, and transparent photographic progress reporting.', 2],
                ['Can you assist diasporan Ghanaians buying land or cars?', 'Yes. Our agency team conducts thorough cadastral title verification, vehicle inspections, and coordinates end-to-end documentation.', 3]
            ];
            $ins = $pdo->prepare("INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)");
            foreach ($faqs as $faq) {
                $ins->execute($faq);
            }
        }

        // Seed default Blog Posts
        $stmt = $pdo->query("SELECT COUNT(*) FROM posts");
        if ($stmt->fetchColumn() == 0) {
            $posts = [
                [
                    'Key Considerations Before Buying Land in Accra, Ghana',
                    'key-considerations-before-buying-land-in-accra-ghana',
                    'Navigating title searches, zoning restrictions, site inspection, and transaction coordination when acquiring real estate in Ghana.',
                    'Real Estate & Construction',
                    'Eric Semanu-Uzziah Dornyo',
                    '/images/agency-property.jpg',
                    1,
                    date('Y-m-d H:i:s')
                ],
                [
                    'Building an Inspection-Ready Workplace: HR & Labor Compliance in Ghana',
                    'building-an-inspection-ready-workplace-hr-compliance-ghana',
                    'Essential workplace policies, employment contracts, and statutory compliance required under Ghana\'s Labor Act.',
                    'Human Resources',
                    'Raphael Cameron Etse',
                    '/images/practice-hr.jpg',
                    1,
                    date('Y-m-d H:i:s')
                ],
                [
                    'Strategic Project Supervision: How Proper Planning Cuts Building Costs',
                    'strategic-project-supervision-how-planning-cuts-building-costs',
                    'Why active on-site project coordination and transparent material budgeting prevent costly delays in construction projects.',
                    'Construction & Project Management',
                    'Eric Semanu-Uzziah Dornyo',
                    '/images/practice-construction.jpg',
                    1,
                    date('Y-m-d H:i:s')
                ]
            ];
            $ins = $pdo->prepare("INSERT INTO posts (title, slug, excerpt, category, author, cover_image, published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($posts as $post) {
                $ins->execute($post);
            }
        }
    }
}
