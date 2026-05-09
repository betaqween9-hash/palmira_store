-- ============================================================
-- Palmyra Store - Production Database Schema (Final v2.0)
-- Engine: MySQL / MariaDB
-- Charset: utf8mb4 (full Arabic + emoji support)
-- Date: 2026-05-08
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 1. ROLES
-- ============================================================
CREATE TABLE `roles` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE COMMENT 'admin, employee',
    `display_name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `name`, `display_name`, `description`) VALUES
(1, 'admin', 'مشرف', 'صلاحيات كاملة على لوحة التحكم'),
(2, 'employee', 'موظف', 'صلاحيات محدودة - إدارة الطلبات فقط');

-- ============================================================
-- 2. PERMISSIONS
-- ============================================================
CREATE TABLE `permissions` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE COMMENT 'e.g. products.create',
    `display_name` VARCHAR(150) NOT NULL,
    `module` VARCHAR(50) NOT NULL COMMENT 'products, orders, users, settings...',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `permissions` (`name`, `display_name`, `module`) VALUES
('products.view', 'عرض المنتجات', 'products'),
('products.create', 'إضافة منتجات', 'products'),
('products.edit', 'تعديل المنتجات', 'products'),
('products.delete', 'حذف المنتجات', 'products'),
('orders.view', 'عرض الطلبات', 'orders'),
('orders.edit', 'تعديل الطلبات', 'orders'),
('categories.manage', 'إدارة الأقسام', 'categories'),
('brands.manage', 'إدارة الماركات', 'brands'),
('customers.view', 'عرض العملاء', 'customers'),
('users.manage', 'إدارة المستخدمين', 'users'),
('settings.manage', 'إدارة الإعدادات', 'settings'),
('offers.manage', 'إدارة العروض', 'offers'),
('banners.manage', 'إدارة البنرات', 'banners'),
('notifications.send', 'إرسال الإشعارات', 'notifications'),
('currencies.manage', 'إدارة العملات', 'currencies');

-- ============================================================
-- 3. ROLE_PERMISSIONS (Pivot)
-- ============================================================
CREATE TABLE `role_permissions` (
    `role_id` INT UNSIGNED NOT NULL,
    `permission_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`role_id`, `permission_id`),
    CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_rp_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 1, `id` FROM `permissions`;

INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 2, `id` FROM `permissions` WHERE `name` IN ('orders.view', 'orders.edit');

-- ============================================================
-- 4. ADMIN_USERS
-- ============================================================
CREATE TABLE `admin_users` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(100) NOT NULL,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role_id` INT UNSIGNED NOT NULL DEFAULT 2,
    `status` ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
    `avatar` VARCHAR(500) NULL,
    `last_login_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_admin_role` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admin_users` (`id`, `full_name`, `username`, `password_hash`, `role_id`, `status`) VALUES
(1, 'المشرف', 'admin', '$2y$10$PLACEHOLDER_HASH_ADMIN', 1, 'active'),
(2, 'موظف', 'employee', '$2y$10$PLACEHOLDER_HASH_EMPLOYEE', 2, 'active');

-- ============================================================
-- 5. CUSTOMERS
-- ============================================================
CREATE TABLE `customers` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `phone` VARCHAR(20) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `governorate` VARCHAR(100) NULL COMMENT 'المحافظة',
    `status` ENUM('active', 'blocked') NOT NULL DEFAULT 'active',
    `orders_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `total_spent` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_customer_phone` (`phone`),
    INDEX `idx_customer_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. CATEGORIES (Recursive Hierarchy via parent_id)
-- Product links to deepest category only (Leaf Node)
-- Ancestors are resolved via parent_id chain
-- ============================================================
CREATE TABLE `categories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(200) NOT NULL UNIQUE,
    `parent_id` INT UNSIGNED NULL COMMENT 'NULL=root, else child',
    `level` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '0=main, 1=sub, 2=inner',
    `image` VARCHAR(500) NULL,
    `sort_order` INT NOT NULL DEFAULT 0,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `deleted_at` TIMESTAMP NULL COMMENT 'Soft delete',
    `created_by` INT UNSIGNED NULL,
    `updated_by` INT UNSIGNED NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_cat_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_cat_created_by` FOREIGN KEY (`created_by`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_cat_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL,
    CONSTRAINT `chk_cat_level_parent` CHECK (
        (`level` = 0 AND `parent_id` IS NULL)
        OR (`level` IN (1, 2) AND `parent_id` IS NOT NULL)
    ),
    INDEX `idx_cat_parent` (`parent_id`),
    INDEX `idx_cat_slug` (`slug`),
    INDEX `idx_cat_level` (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. BRANDS
-- ============================================================
CREATE TABLE `brands` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(150) NOT NULL UNIQUE,
    `letter` CHAR(2) NULL COMMENT 'First letter for alphabetical display',
    `image` VARCHAR(500) NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `deleted_at` TIMESTAMP NULL COMMENT 'Soft delete',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_brand_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. SKIN_TYPES
-- ============================================================
CREATE TABLE `skin_types` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `image` VARCHAR(500) NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `skin_types` (`name`) VALUES
('البشرة العادية'), ('البشرة الجافة'), ('البشرة الدهنية'),
('البشرة المختلطة'), ('البشرة الحساسة');

-- ============================================================
-- 9. PRODUCTS
-- category_id points to the deepest (leaf) category.
-- Use WITH RECURSIVE on categories.parent_id to get ancestors.
-- ============================================================
CREATE TABLE `products` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(300) NOT NULL UNIQUE,
    `description` TEXT NULL,
    `price` DECIMAL(10,2) NOT NULL,
    `old_price` DECIMAL(10,2) NULL COMMENT 'Price before discount',
    `cost_price` DECIMAL(10,2) NULL COMMENT 'Purchase cost for profit calc',
    `quantity` INT UNSIGNED NOT NULL DEFAULT 0,
    `sku` VARCHAR(50) NULL UNIQUE COMMENT 'Stock Keeping Unit',
    `category_id` INT UNSIGNED NULL COMMENT 'Leaf category only',
    `brand_id` INT UNSIGNED NULL,
    `skin_type_id` INT UNSIGNED NULL,
    `size` VARCHAR(100) NULL COMMENT 'e.g. 50g, Large, Travel Size',
    `volume` VARCHAR(50) NULL COMMENT 'Capacity: 50ml, 100ml, 200ml',
    `usage_info` TEXT NULL COMMENT 'Usage instructions',
    `is_new` TINYINT(1) NOT NULL DEFAULT 0,
    `is_sale` TINYINT(1) NOT NULL DEFAULT 0,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `views_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `deleted_at` TIMESTAMP NULL COMMENT 'Soft delete',
    `created_by` INT UNSIGNED NULL,
    `updated_by` INT UNSIGNED NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_prod_cat` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_prod_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_prod_skin` FOREIGN KEY (`skin_type_id`) REFERENCES `skin_types`(`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_prod_created_by` FOREIGN KEY (`created_by`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_prod_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL,
    INDEX `idx_prod_slug` (`slug`),
    INDEX `idx_prod_cat` (`category_id`),
    INDEX `idx_prod_brand` (`brand_id`),
    INDEX `idx_prod_skin` (`skin_type_id`),
    INDEX `idx_prod_price` (`price`),
    INDEX `idx_prod_active` (`is_active`),
    INDEX `idx_prod_deleted` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. PRODUCT_IMAGES
-- ============================================================
CREATE TABLE `product_images` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT UNSIGNED NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `sort_order` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `is_primary` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_pimg_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    INDEX `idx_pimg_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. ORDERS
-- ============================================================
CREATE TABLE `orders` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `order_number` VARCHAR(20) NOT NULL UNIQUE COMMENT 'Human-readable e.g. ORD-2026-0001',
    `customer_id` INT UNSIGNED NOT NULL,
    `customer_name` VARCHAR(100) NOT NULL COMMENT 'Snapshot at order time',
    `customer_phone` VARCHAR(20) NULL,
    `customer_email` VARCHAR(150) NULL,
    `customer_governorate` VARCHAR(100) NULL,
    `delivery_latitude` DECIMAL(10,7) NULL,
    `delivery_longitude` DECIMAL(10,7) NULL,
    `delivery_details` TEXT NULL COMMENT 'Address description',
    `subtotal` DECIMAL(12,2) NOT NULL,
    `delivery_fee` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `discount_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `total` DECIMAL(12,2) NOT NULL,
    `currency_id` INT UNSIGNED NOT NULL DEFAULT 1,
    `payment_method` ENUM('cash','bank','paytabs','jeib','flousk') NOT NULL DEFAULT 'cash',
    `transfer_proof` VARCHAR(500) NULL COMMENT 'Server file path for proof image',
    `verification_status` ENUM('pending_verification','verified','rejected') NOT NULL DEFAULT 'verified',
    `status` ENUM('pending','processing','ready','shipped','delivered','cancelled','returned','refunded') NOT NULL DEFAULT 'pending',
    `notes` TEXT NULL,
    `admin_notes` TEXT NULL COMMENT 'Internal notes by admin',
    `cancelled_reason` VARCHAR(500) NULL,
    `paid_at` TIMESTAMP NULL COMMENT 'When payment confirmed',
    `delivered_at` TIMESTAMP NULL COMMENT 'When order delivered',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_order_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_order_currency` FOREIGN KEY (`currency_id`) REFERENCES `currencies`(`id`) ON DELETE RESTRICT,
    INDEX `idx_order_customer` (`customer_id`),
    INDEX `idx_order_status` (`status`),
    INDEX `idx_order_date` (`created_at`),
    INDEX `idx_order_payment` (`payment_method`),
    INDEX `idx_order_verification` (`verification_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. ORDER_ITEMS (fully separated - snapshots survive soft delete)
-- ============================================================
CREATE TABLE `order_items` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT UNSIGNED NOT NULL,
    `product_id` INT UNSIGNED NULL COMMENT 'NULL if product hard-deleted',
    `product_name` VARCHAR(255) NOT NULL COMMENT 'Snapshot',
    `product_image` VARCHAR(500) NULL COMMENT 'Snapshot',
    `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
    `unit_price` DECIMAL(10,2) NOT NULL COMMENT 'Price at order time',
    `total_price` DECIMAL(10,2) NOT NULL COMMENT 'quantity * unit_price',
    CONSTRAINT `fk_oi_order` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_oi_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL,
    INDEX `idx_oi_order` (`order_id`),
    INDEX `idx_oi_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13. OFFERS
-- ============================================================
CREATE TABLE `offers` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT UNSIGNED NOT NULL,
    `discount_type` ENUM('percentage','fixed') NOT NULL DEFAULT 'percentage',
    `discount_value` DECIMAL(10,2) NOT NULL COMMENT '0-100 for %, or fixed amount',
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_by` INT UNSIGNED NULL,
    `updated_by` INT UNSIGNED NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_offer_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_offer_created_by` FOREIGN KEY (`created_by`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_offer_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL,
    CONSTRAINT `chk_offer_dates` CHECK (`end_date` >= `start_date`),
    INDEX `idx_offer_product` (`product_id`),
    INDEX `idx_offer_dates` (`start_date`, `end_date`),
    INDEX `idx_offer_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 14. BANNERS (3 fixed positions)
-- ============================================================
CREATE TABLE `banners` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `position` TINYINT UNSIGNED NOT NULL UNIQUE COMMENT '0, 1, 2 only',
    `image` VARCHAR(500) NULL,
    `link` VARCHAR(500) NULL,
    `title` VARCHAR(200) NULL,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `chk_banner_position` CHECK (`position` IN (0, 1, 2))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `banners` (`position`) VALUES (0), (1), (2);

-- ============================================================
-- 15. NOTIFICATIONS (unified admin + store)
-- ============================================================
CREATE TABLE `notifications` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `type` ENUM('system','order','promotion','admin') NOT NULL DEFAULT 'system',
    `recipient_type` ENUM('all_customers','specific_customer','admin_panel') NOT NULL DEFAULT 'all_customers',
    `recipient_id` INT UNSIGNED NULL COMMENT 'customer_id or admin_user_id',
    `title` VARCHAR(255) NOT NULL,
    `body` TEXT NOT NULL,
    `is_read` TINYINT(1) NOT NULL DEFAULT 0,
    `related_order_id` INT UNSIGNED NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_notif_order` FOREIGN KEY (`related_order_id`) REFERENCES `orders`(`id`) ON DELETE SET NULL,
    INDEX `idx_notif_recipient` (`recipient_type`, `recipient_id`),
    INDEX `idx_notif_read` (`is_read`),
    INDEX `idx_notif_date` (`created_at`),
    INDEX `idx_notif_order` (`related_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 16. CURRENCIES
-- ============================================================
CREATE TABLE `currencies` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `code` VARCHAR(5) NOT NULL UNIQUE COMMENT 'ISO: SAR, USD, EUR',
    `symbol` VARCHAR(10) NULL COMMENT 'ر.س, $, €',
    `exchange_rate` DECIMAL(12,6) NOT NULL DEFAULT 1.000000,
    `is_default` TINYINT(1) NOT NULL DEFAULT 0,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_currency_code` (`code`),
    INDEX `idx_currency_default` (`is_default`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `currencies` (`name`, `code`, `symbol`, `exchange_rate`, `is_default`, `is_active`) VALUES
('ريال سعودي', 'SAR', 'ر.س', 1.000000, 1, 1),
('دولار أمريكي', 'USD', '$', 0.266700, 0, 1),
('يورو', 'EUR', '€', 0.244800, 0, 1),
('درهم إماراتي', 'AED', 'د.إ', 0.979600, 0, 1),
('جنيه إسترليني', 'GBP', '£', 0.210300, 0, 0);

-- ============================================================
-- 17. STORE_SETTINGS (key-value)
-- ============================================================
CREATE TABLE `store_settings` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `setting_key` VARCHAR(100) NOT NULL UNIQUE,
    `setting_value` TEXT NULL,
    `setting_type` ENUM('string','number','boolean','json') NOT NULL DEFAULT 'string',
    `description` VARCHAR(255) NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `store_settings` (`setting_key`, `setting_value`, `setting_type`, `description`) VALUES
('store_name', 'بالميرا ستور', 'string', 'اسم المتجر'),
('store_phone', '0500000000', 'string', 'رقم الهاتف'),
('store_email', 'info@palmira.com', 'string', 'البريد الإلكتروني'),
('store_address', 'المملكة العربية السعودية', 'string', 'عنوان المتجر'),
('delivery_price', '20', 'number', 'سعر التوصيل الافتراضي'),
('free_delivery_threshold', '200', 'number', 'الحد الأدنى للتوصيل المجاني'),
('default_currency_id', '1', 'number', 'العملة الافتراضية'),
('whatsapp_number', '966500000000', 'string', 'رقم الواتساب');

-- ============================================================
-- 18. CARTS (one per customer)
-- ============================================================
CREATE TABLE `carts` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `customer_id` INT UNSIGNED NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_cart_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 19. CART_ITEMS
-- ============================================================
CREATE TABLE `cart_items` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `cart_id` INT UNSIGNED NOT NULL,
    `product_id` INT UNSIGNED NOT NULL,
    `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
    `added_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ci_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ci_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `uq_cart_product` (`cart_id`, `product_id`),
    INDEX `idx_ci_cart` (`cart_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- VIEWS
-- ============================================================

-- Daily sales
CREATE OR REPLACE VIEW `v_daily_sales` AS
SELECT DATE(`created_at`) AS `sale_date`,
    COUNT(*) AS `orders_count`,
    SUM(`total`) AS `total_revenue`,
    SUM(`delivery_fee`) AS `total_delivery`,
    AVG(`total`) AS `avg_order_value`
FROM `orders`
WHERE `status` NOT IN ('cancelled','returned','refunded')
GROUP BY DATE(`created_at`) ORDER BY `sale_date` DESC;

-- Monthly sales
CREATE OR REPLACE VIEW `v_monthly_sales` AS
SELECT YEAR(`created_at`) AS `year`, MONTH(`created_at`) AS `month`,
    COUNT(*) AS `orders_count`, SUM(`total`) AS `total_revenue`
FROM `orders`
WHERE `status` NOT IN ('cancelled','returned','refunded')
GROUP BY YEAR(`created_at`), MONTH(`created_at`)
ORDER BY `year` DESC, `month` DESC;

-- Top products (dynamic popularity)
CREATE OR REPLACE VIEW `v_top_products` AS
SELECT p.`id`, p.`name`, p.`slug`, p.`price`,
    COALESCE(SUM(oi.`quantity`), 0) AS `total_sold`,
    COALESCE(SUM(oi.`total_price`), 0) AS `total_revenue`,
    p.`views_count`
FROM `products` p
LEFT JOIN `order_items` oi ON p.`id` = oi.`product_id`
LEFT JOIN `orders` o ON oi.`order_id` = o.`id`
    AND o.`status` NOT IN ('cancelled','returned','refunded')
WHERE p.`deleted_at` IS NULL AND p.`is_active` = 1
GROUP BY p.`id` ORDER BY `total_sold` DESC;

-- Active products (storefront-safe)
CREATE OR REPLACE VIEW `v_active_products` AS
SELECT p.*, b.`name` AS `brand_name`, b.`slug` AS `brand_slug`
FROM `products` p
LEFT JOIN `brands` b ON p.`brand_id` = b.`id` AND b.`deleted_at` IS NULL
WHERE p.`deleted_at` IS NULL AND p.`is_active` = 1;

-- Active categories (storefront-safe)
CREATE OR REPLACE VIEW `v_active_categories` AS
SELECT * FROM `categories`
WHERE `deleted_at` IS NULL AND `is_active` = 1
ORDER BY `level` ASC, `sort_order` ASC;

-- Active brands (storefront-safe)
CREATE OR REPLACE VIEW `v_active_brands` AS
SELECT * FROM `brands`
WHERE `deleted_at` IS NULL AND `is_active` = 1
ORDER BY `name` ASC;

-- ============================================================
-- HELPER: Get category ancestors (usage example)
-- ============================================================
-- WITH RECURSIVE cat_tree AS (
--     SELECT * FROM categories WHERE id = @leaf_category_id
--     UNION ALL
--     SELECT c.* FROM categories c
--     JOIN cat_tree ct ON c.id = ct.parent_id
-- )
-- SELECT * FROM cat_tree;
-- Result: سيرومات الوجه → العناية بالوجه → العناية بالبشرة
