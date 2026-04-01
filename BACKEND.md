# IKEO - Backend Documentation

> E-Commerce Furniture (Scandinavian Design) — Laravel Backend

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Database Schema](#database-schema)
- [Models & Relationships](#models--relationships)
- [Middleware](#middleware)
- [Web Routes (Admin Dashboard)](#web-routes-admin-dashboard)
- [API Routes (Frontend / Mobile)](#api-routes-frontend--mobile)
- [Authentication](#authentication)
- [File Uploads](#file-uploads)
- [Seeders](#seeders)

---

## Tech Stack

| Component | Version / Package |
|---|---|
| Framework | Laravel 13 |
| PHP | ^8.3 |
| Database | MySQL |
| Auth (Web) | Laravel Fortify (session + 2FA) |
| Auth (API) | Laravel Sanctum (token-based) |
| Frontend Bridge | Inertia.js (React) |

---

## Getting Started

```bash
# 1. Install dependencies
composer install
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Generate app key
php artisan key:generate

# 4. Create MySQL database
#    Database name: final-project-bootcamp

# 5. Run migrations and seed
php artisan migrate:fresh --seed

# 6. Create storage symlink
php artisan storage:link

# 7. Start development server
composer dev
```

---

## Environment Configuration

Key `.env` values configured:

```env
DB_CONNECTION=mysql
DB_DATABASE=final-project-bootcamp
DB_USERNAME=root
DB_PASSWORD=

APP_URL=http://localhost:8000

MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
```

---

## Database Schema

20 migrations in total (4 system + 16 application).

### System Tables (pre-existing)

| Migration | Tables |
|---|---|
| `0001_01_01_000000` | `users`, `password_reset_tokens`, `sessions` |
| `0001_01_01_000001` | `cache`, `cache_locks` |
| `0001_01_01_000002` | `jobs`, `job_batches`, `failed_jobs` |
| `2025_08_14_170933` | Adds two-factor columns to `users` |

### Application Tables

| Migration | Table | Key Columns |
|---|---|---|
| `2025_08_15_100001` | `categories` | name, name_id, slug (unique), icon, description, description_id, image |
| `2025_08_15_100002` | `brands` | name, slug (unique), logo, description |
| `2025_08_15_100003` | `products` | FK→categories, FK→brands, name, slug (unique), description, description_id, price, discount_price, image, stock, is_bestseller, is_featured, material, dimensions, weight |
| `2025_08_15_100004` | `product_variants` | FK→products, variant_name, color, size, material, sku (unique), price, stock, image, is_active |
| `2025_08_15_100005` | `product_images` | FK→products, image_url, sort_order |
| `2025_08_15_100006` | `addresses` | FK→users, label, recipient_name, phone, address, city, province, postal_code, is_default |
| `2025_08_15_100007` | `orders` | FK→users, FK→addresses, order_number (unique), status (enum), payment_method (enum), courier (enum), subtotal, shipping_cost, tax, total, notes, paid_at, shipped_at, delivered_at |
| `2025_08_15_100008` | `order_items` | FK→orders, FK→products, FK→product_variants (nullable), product_name, variant_name, price, quantity, subtotal |
| `2025_08_15_100009` | `wishlists` | FK→users, FK→products, unique(user_id, product_id) |
| `2025_08_15_100010` | `reviews` | FK→users, FK→products, rating (1-5), comment, unique(user_id, product_id) |
| `2025_08_15_100011` | `blogs` | FK→users (author_id), title, title_id, slug (unique), excerpt, excerpt_id, content, content_id, category, category_id_text, image, published_at |
| `2025_08_15_100012` | `blog_tags` | FK→blogs, tag, tag_id |
| `2025_08_15_100013` | `stores` | name, address, city, phone, latitude, longitude, hours_id, hours_en |
| `2025_08_15_100014` | `consultations` | FK→users (nullable), FK→stores (nullable), name, email, phone, preferred_date, message, status (enum) |
| `2025_08_15_100015` | `newsletter_subscribers` | email (unique), is_active |
| `2025_08_15_100016` | `personal_access_tokens` | Sanctum token storage |

### Enums

| Table | Column | Values |
|---|---|---|
| users | role | `admin`, `user` |
| orders | status | `pending`, `processing`, `shipped`, `delivered`, `cancelled` |
| orders | payment_method | `transfer`, `ewallet` |
| orders | courier | `JNE`, `GoSend`, `SiCepat` |
| consultations | status | `pending`, `confirmed`, `completed`, `cancelled` |

### Bilingual Fields

Several tables support Indonesian translations:

- `categories` → name_id, description_id
- `products` → description_id
- `blogs` → title_id, excerpt_id, content_id, category_id_text
- `blog_tags` → tag_id
- `stores` → hours_id, hours_en

---

## Models & Relationships

### User

**Location:** `app/Models/User.php`

| Trait | Purpose |
|---|---|
| HasFactory | Factory support |
| Notifiable | Notification support |
| TwoFactorAuthenticatable | 2FA via Fortify |
| HasApiTokens | API tokens via Sanctum |

| Relationship | Type | Target |
|---|---|---|
| addresses | HasMany | Address |
| orders | HasMany | Order |
| wishlists | HasMany | Wishlist |
| reviews | HasMany | Review |
| blogs | HasMany | Blog (via author_id) |
| consultations | HasMany | Consultation |

**Fillable:** name, email, password, role, phone, avatar

---

### Category

**Location:** `app/Models/Category.php`

| Relationship | Type | Target |
|---|---|---|
| products | HasMany | Product |

**Fillable:** name, name_id, slug, icon, description, description_id, image

---

### Brand

**Location:** `app/Models/Brand.php`

| Relationship | Type | Target |
|---|---|---|
| products | HasMany | Product |

**Fillable:** name, slug, logo, description

---

### Product

**Location:** `app/Models/Product.php`

| Relationship | Type | Target |
|---|---|---|
| category | BelongsTo | Category |
| brand | BelongsTo | Brand |
| variants | HasMany | ProductVariant |
| images | HasMany | ProductImage |
| reviews | HasMany | Review |
| wishlists | HasMany | Wishlist |

**Fillable:** category_id, brand_id, name, slug, description, description_id, price, discount_price, image, stock, is_bestseller, is_featured, material, dimensions, weight

**Casts:** price, discount_price, weight → decimal:2 | is_bestseller, is_featured → boolean

---

### ProductVariant

**Location:** `app/Models/ProductVariant.php`

| Relationship | Type | Target |
|---|---|---|
| product | BelongsTo | Product |
| orderItems | HasMany | OrderItem |

**Fillable:** product_id, variant_name, color, size, material, sku, price, stock, image, is_active

**Casts:** price → decimal:2 | is_active → boolean

---

### ProductImage

**Location:** `app/Models/ProductImage.php`

| Relationship | Type | Target |
|---|---|---|
| product | BelongsTo | Product |

**Fillable:** product_id, image_url, sort_order

---

### Address

**Location:** `app/Models/Address.php`

| Relationship | Type | Target |
|---|---|---|
| user | BelongsTo | User |
| orders | HasMany | Order |

**Fillable:** user_id, label, recipient_name, phone, address, city, province, postal_code, is_default

**Casts:** is_default → boolean

---

### Order

**Location:** `app/Models/Order.php`

| Relationship | Type | Target |
|---|---|---|
| user | BelongsTo | User |
| address | BelongsTo | Address |
| orderItems | HasMany | OrderItem |

**Fillable:** user_id, address_id, order_number, status, payment_method, courier, subtotal, shipping_cost, tax, total, notes, paid_at, shipped_at, delivered_at

**Casts:** subtotal, shipping_cost, tax, total → decimal:2 | paid_at, shipped_at, delivered_at → datetime

---

### OrderItem

**Location:** `app/Models/OrderItem.php`

| Relationship | Type | Target |
|---|---|---|
| order | BelongsTo | Order |
| product | BelongsTo | Product |
| productVariant | BelongsTo | ProductVariant |

**Fillable:** order_id, product_id, product_variant_id, product_name, variant_name, price, quantity, subtotal

**Casts:** price, subtotal → decimal:2

---

### Wishlist

**Location:** `app/Models/Wishlist.php`

| Relationship | Type | Target |
|---|---|---|
| user | BelongsTo | User |
| product | BelongsTo | Product |

**Fillable:** user_id, product_id

---

### Review

**Location:** `app/Models/Review.php`

| Relationship | Type | Target |
|---|---|---|
| user | BelongsTo | User |
| product | BelongsTo | Product |

**Fillable:** user_id, product_id, rating, comment

---

### Blog

**Location:** `app/Models/Blog.php`

| Relationship | Type | Target |
|---|---|---|
| author | BelongsTo | User (via author_id) |
| tags | HasMany | BlogTag |

**Fillable:** author_id, title, title_id, slug, excerpt, excerpt_id, content, content_id, category, category_id_text, image, published_at

**Casts:** published_at → datetime

---

### BlogTag

**Location:** `app/Models/BlogTag.php`

| Relationship | Type | Target |
|---|---|---|
| blog | BelongsTo | Blog |

**Fillable:** blog_id, tag, tag_id

---

### Store

**Location:** `app/Models/Store.php`

| Relationship | Type | Target |
|---|---|---|
| consultations | HasMany | Consultation |

**Fillable:** name, address, city, phone, latitude, longitude, hours_id, hours_en

**Casts:** latitude, longitude → decimal:8

---

### Consultation

**Location:** `app/Models/Consultation.php`

| Relationship | Type | Target |
|---|---|---|
| user | BelongsTo | User |
| store | BelongsTo | Store |

**Fillable:** user_id, store_id, name, email, phone, preferred_date, message, status

**Casts:** preferred_date → date

---

### NewsletterSubscriber

**Location:** `app/Models/NewsletterSubscriber.php`

**Fillable:** email, is_active

**Casts:** is_active → boolean

---

## Middleware

### CheckAdmin

**Location:** `app/Http/Middleware/CheckAdmin.php`
**Alias:** `checkAdmin`
**Registered in:** `bootstrap/app.php`

Logic:
1. If not authenticated → redirect to login
2. If authenticated but role is NOT `admin` → logout + redirect with error message
3. If admin → proceed

Used on all `dashboard/*` web routes.

### HandleInertiaRequests

Shares to all Inertia pages:
- `name` — app name from config
- `auth.user` — current authenticated user
- `sidebarOpen` — sidebar state from cookie

### HandleAppearance

Handles appearance/theme cookie.

---

## Web Routes (Admin Dashboard)

All admin routes are prefixed with `/dashboard` and protected by `auth` + `checkAdmin` middleware.

### Dashboard

| Method | URI | Action |
|---|---|---|
| GET | `/dashboard` | DashboardController@index |

Returns stats: categories count, brands count, products count, users count, orders count, revenue, total stock, out of stock count, latest orders, latest products, low stock products.

### Categories

| Method | URI | Name | Action |
|---|---|---|---|
| GET | `/dashboard/categories` | categories.index | index — paginated, searchable |
| GET | `/dashboard/categories/create` | categories.create | create form |
| POST | `/dashboard/categories` | categories.store | store with image upload, auto-slug |
| GET | `/dashboard/categories/{category}/edit` | categories.edit | edit form |
| PUT/PATCH | `/dashboard/categories/{category}` | categories.update | update |
| DELETE | `/dashboard/categories/{category}` | categories.destroy | delete |

### Brands

| Method | URI | Name | Action |
|---|---|---|---|
| GET | `/dashboard/brands` | brands.index | index — paginated, searchable |
| GET | `/dashboard/brands/create` | brands.create | create form |
| POST | `/dashboard/brands` | brands.store | store with logo upload, auto-slug |
| GET | `/dashboard/brands/{brand}/edit` | brands.edit | edit form |
| PUT/PATCH | `/dashboard/brands/{brand}` | brands.update | update |
| DELETE | `/dashboard/brands/{brand}` | brands.destroy | delete |

### Products

| Method | URI | Name | Action |
|---|---|---|---|
| GET | `/dashboard/products` | products.index | index — paginated, searchable, filterable by category/brand |
| GET | `/dashboard/products/create` | products.create | create form |
| POST | `/dashboard/products` | products.store | store with image upload, auto-slug |
| GET | `/dashboard/products/{product}/edit` | products.edit | edit form (loads images) |
| PUT/PATCH | `/dashboard/products/{product}` | products.update | update |
| DELETE | `/dashboard/products/{product}` | products.destroy | delete (cascades variants, images) |

### Product Variants (nested under products)

| Method | URI | Name | Action |
|---|---|---|---|
| GET | `/dashboard/products/{product_id}/variants` | variants.index | index — paginated, searchable |
| GET | `/dashboard/products/{product_id}/variants/create` | variants.create | create form |
| POST | `/dashboard/products/{product_id}/variants` | variants.store | store with image upload |
| GET | `/dashboard/products/{product_id}/variants/{variant_id}/edit` | variants.edit | edit form |
| PATCH | `/dashboard/products/{product_id}/variants/{variant_id}` | variants.update | update |
| DELETE | `/dashboard/products/{product_id}/variants/{variant_id}` | variants.destroy | delete |

### Orders

| Method | URI | Name | Action |
|---|---|---|---|
| GET | `/dashboard/orders` | orders.index | index — paginated, searchable by order_number, filterable by status |
| GET | `/dashboard/orders/{order}` | orders.show | show with user, address, items |
| PATCH | `/dashboard/orders/{order}` | orders.update | update status (auto-sets shipped_at / delivered_at) |

### Blogs

| Method | URI | Name | Action |
|---|---|---|---|
| GET | `/dashboard/blogs` | blogs.index | index — paginated, searchable |
| GET | `/dashboard/blogs/create` | blogs.create | create form |
| POST | `/dashboard/blogs` | blogs.store | store with image, tags, auto-slug, auto author_id |
| GET | `/dashboard/blogs/{blog}/edit` | blogs.edit | edit form (loads tags) |
| PUT/PATCH | `/dashboard/blogs/{blog}` | blogs.update | update (replaces tags) |
| DELETE | `/dashboard/blogs/{blog}` | blogs.destroy | delete (cascades tags) |

### Stores

| Method | URI | Name | Action |
|---|---|---|---|
| GET | `/dashboard/stores` | stores.index | index — paginated, searchable |
| GET | `/dashboard/stores/create` | stores.create | create form |
| POST | `/dashboard/stores` | stores.store | store |
| GET | `/dashboard/stores/{store}/edit` | stores.edit | edit form |
| PUT/PATCH | `/dashboard/stores/{store}` | stores.update | update |
| DELETE | `/dashboard/stores/{store}` | stores.destroy | delete |

### Consultations

| Method | URI | Name | Action |
|---|---|---|---|
| GET | `/dashboard/consultations` | consultations.index | index — paginated, searchable, filterable by status |
| GET | `/dashboard/consultations/{consultation}` | consultations.show | show with user, store |
| PATCH | `/dashboard/consultations/{consultation}` | consultations.update | update status |

### Reviews

| Method | URI | Name | Action |
|---|---|---|---|
| GET | `/dashboard/reviews` | reviews.index | index — paginated, searchable by product name |
| DELETE | `/dashboard/reviews/{review}` | reviews.destroy | delete (moderate) |

---

## API Routes (Frontend / Mobile)

Base URL: `/api`

### Public Endpoints (no auth required)

#### Auth

| Method | URI | Action | Description |
|---|---|---|---|
| POST | `/api/register` | AuthController@register | Register new user. Returns user + token. |
| POST | `/api/login` | AuthController@login | Login. Only `role: user` allowed. Returns user + token. |

**Register payload:**
```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required, min:8)",
  "password_confirmation": "string (required)"
}
```

**Login payload:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

#### Categories

| Method | URI | Action | Description |
|---|---|---|---|
| GET | `/api/categories` | CategoryController@index | List all categories with product count |
| GET | `/api/categories/{slug}` | CategoryController@show | Category detail with products |

#### Brands

| Method | URI | Action | Description |
|---|---|---|---|
| GET | `/api/brands` | BrandController@index | List all brands with product count |
| GET | `/api/brands/{slug}` | BrandController@show | Brand detail with products |

#### Products

| Method | URI | Action | Description |
|---|---|---|---|
| GET | `/api/products` | ProductController@index | Paginated product list |
| GET | `/api/products/{slug}` | ProductController@show | Product detail with variants, images, reviews, avg rating |

**Product list query params:**
- `search` — search by name
- `category` — filter by category slug
- `brand` — filter by brand slug
- `min_price` / `max_price` — price range
- `bestseller=1` — bestsellers only
- `featured=1` — featured only
- `sort` — `price_asc` or `price_desc` (default: latest)
- `per_page` — items per page (default: 12)

#### Blogs

| Method | URI | Action | Description |
|---|---|---|---|
| GET | `/api/blogs` | BlogController@index | Published blogs, paginated |
| GET | `/api/blogs/{slug}` | BlogController@show | Blog detail with author, tags |

**Blog list query params:**
- `category` — filter by category
- `search` — search by title
- `per_page` — items per page (default: 10)

#### Stores

| Method | URI | Action | Description |
|---|---|---|---|
| GET | `/api/stores` | StoreController@index | List all store locations |

#### Newsletter

| Method | URI | Action | Description |
|---|---|---|---|
| POST | `/api/newsletter` | NewsletterController@subscribe | Subscribe email (upsert) |

**Payload:**
```json
{
  "email": "string (required)"
}
```

#### Consultations

| Method | URI | Action | Description |
|---|---|---|---|
| POST | `/api/consultations` | ConsultationController@store | Book a consultation |

**Payload:**
```json
{
  "store_id": "integer (optional)",
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string (required)",
  "preferred_date": "date (required, after today)",
  "message": "string (optional)"
}
```

---

### Authenticated Endpoints (requires `Authorization: Bearer {token}`)

#### Profile

| Method | URI | Action | Description |
|---|---|---|---|
| POST | `/api/logout` | AuthController@logout | Revoke current token |
| GET | `/api/profile` | AuthController@profile | Get user with addresses |
| POST | `/api/profile` | AuthController@updateProfile | Update name, phone, avatar |

**Update profile payload (multipart/form-data):**
```
name: string (optional)
phone: string (optional)
avatar: file (optional, jpeg/png/jpg/webp, max 2MB)
```

#### Addresses

| Method | URI | Action | Description |
|---|---|---|---|
| GET | `/api/addresses` | AddressController@index | List user's addresses |
| POST | `/api/addresses` | AddressController@store | Create address |
| PUT | `/api/addresses/{id}` | AddressController@update | Update address |
| DELETE | `/api/addresses/{id}` | AddressController@destroy | Delete address |

**Address payload:**
```json
{
  "label": "string (required, max:50)",
  "recipient_name": "string (required)",
  "phone": "string (required)",
  "address": "string (required)",
  "city": "string (required)",
  "province": "string (required)",
  "postal_code": "string (required)",
  "is_default": "boolean (optional)"
}
```

When `is_default: true`, all other addresses are set to `is_default: false`.

#### Wishlist

| Method | URI | Action | Description |
|---|---|---|---|
| GET | `/api/wishlist` | WishlistController@index | List user's wishlist with product details |
| POST | `/api/wishlist` | WishlistController@toggle | Toggle wishlist (add/remove) |

**Toggle payload:**
```json
{
  "product_id": "integer (required)"
}
```

**Response includes:** `wishlisted: true/false`

#### Orders

| Method | URI | Action | Description |
|---|---|---|---|
| GET | `/api/orders` | OrderController@index | List user's orders (filterable by status) |
| POST | `/api/orders` | OrderController@store | Create order |
| GET | `/api/orders/{id}` | OrderController@show | Order detail with items |

**Create order payload:**
```json
{
  "address_id": "integer (required)",
  "payment_method": "transfer | ewallet",
  "courier": "JNE | GoSend | SiCepat",
  "notes": "string (optional)",
  "items": [
    {
      "product_id": "integer (required)",
      "product_variant_id": "integer (optional)",
      "quantity": "integer (required, min:1)"
    }
  ]
}
```

**Order calculation:**
- `subtotal` = sum of (price × quantity) for all items
- `shipping_cost` = Rp 15,000 (flat)
- `tax` = 11% of subtotal (PPN)
- `total` = subtotal + shipping_cost + tax
- `order_number` = `IKEO-{random 8 chars}`

Price is taken from variant price if variant is specified, otherwise from product discount_price (if set) or product price.

#### Reviews

| Method | URI | Action | Description |
|---|---|---|---|
| POST | `/api/reviews` | ReviewController@store | Submit a review (1 per product per user) |

**Payload:**
```json
{
  "product_id": "integer (required)",
  "rating": "integer (required, 1-5)",
  "comment": "string (optional)"
}
```

Returns 422 if user already reviewed the product.

---

## Authentication

### Web (Admin Dashboard)

- **Provider:** Laravel Fortify
- **Method:** Session-based
- **Features enabled:** Registration, Password Reset, Email Verification, Two-Factor Authentication
- **Admin access:** Protected by `checkAdmin` middleware — only `role: admin` can access `/dashboard/*`
- **Rate limiting:** 5 login attempts per minute, 5 two-factor attempts per minute

### API (Frontend / Mobile)

- **Provider:** Laravel Sanctum
- **Method:** Bearer token (`Authorization: Bearer {token}`)
- **Token creation:** On register and login
- **Token revocation:** On logout (current token only)
- **Restriction:** Only `role: user` can login via API (admins are blocked)

---

## File Uploads

All file uploads use the `public` disk (`storage/app/public`), accessible via the `/storage` symlink.

| Upload Type | Storage Path | Max Size | Allowed Types |
|---|---|---|---|
| Product images | `products/` | 2MB | jpeg, png, jpg, gif, svg, webp |
| Variant images | `variants/` | 2MB | jpeg, png, jpg, gif, svg, webp |
| Category images | `categories/` | 2MB | jpeg, png, jpg, gif, svg, webp |
| Brand logos | `brands/` | 2MB | jpeg, png, jpg, gif, svg, webp |
| Blog images | `blogs/` | 2MB | jpeg, png, jpg, gif, svg, webp |
| User avatars | `avatars/` | 2MB | jpeg, png, jpg, webp |

---

## Seeders

### AdminSeeder

**Location:** `database/seeders/AdminSeeder.php`

Creates the default admin account:

| Field | Value |
|---|---|
| name | Admin |
| email | admin@ikeo.com |
| password | password |
| role | admin |
| email_verified_at | now() |

### DatabaseSeeder

**Location:** `database/seeders/DatabaseSeeder.php`

Calls `AdminSeeder`, then creates a test user via factory:

| Field | Value |
|---|---|
| name | Test User |
| email | test@example.com |
| password | password |
| role | user (default) |

### Run seeders

```bash
php artisan db:seed              # Run seeders
php artisan migrate:fresh --seed # Fresh migration + seed
```

---

## Project Structure

```
app/
├── Actions/Fortify/
│   ├── CreateNewUser.php          # Registration action
│   └── ResetUserPassword.php      # Password reset action
├── Concerns/
│   ├── PasswordValidationRules.php
│   └── ProfileValidationRules.php
├── Http/
│   ├── Controllers/
│   │   ├── API/                   # 12 API controllers
│   │   │   ├── AddressController.php
│   │   │   ├── AuthController.php
│   │   │   ├── BlogController.php
│   │   │   ├── BrandController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── ConsultationController.php
│   │   │   ├── NewsletterController.php
│   │   │   ├── OrderController.php
│   │   │   ├── ProductController.php
│   │   │   ├── ReviewController.php
│   │   │   ├── StoreController.php
│   │   │   └── WishlistController.php
│   │   ├── Settings/              # Profile & security settings
│   │   ├── BlogController.php     # 10 Web (admin) controllers
│   │   ├── BrandController.php
│   │   ├── CategoryController.php
│   │   ├── ConsultationController.php
│   │   ├── DashboardController.php
│   │   ├── OrderController.php
│   │   ├── ProductController.php
│   │   ├── ProductVariantController.php
│   │   ├── ReviewController.php
│   │   └── StoreController.php
│   ├── Middleware/
│   │   ├── CheckAdmin.php         # Admin role guard
│   │   ├── HandleAppearance.php
│   │   └── HandleInertiaRequests.php
│   └── Requests/Settings/
├── Models/                        # 16 Eloquent models
│   ├── Address.php
│   ├── Blog.php
│   ├── BlogTag.php
│   ├── Brand.php
│   ├── Category.php
│   ├── Consultation.php
│   ├── NewsletterSubscriber.php
│   ├── Order.php
│   ├── OrderItem.php
│   ├── Product.php
│   ├── ProductImage.php
│   ├── ProductVariant.php
│   ├── Review.php
│   ├── Store.php
│   ├── User.php
│   └── Wishlist.php
└── Providers/
    ├── AppServiceProvider.php     # CarbonImmutable, password defaults, DB protection
    └── FortifyServiceProvider.php # Auth views, rate limiting, actions

database/
├── factories/
│   └── UserFactory.php
├── migrations/                    # 20 migration files
└── seeders/
    ├── AdminSeeder.php
    └── DatabaseSeeder.php

routes/
├── api.php                        # 28 API routes
├── web.php                        # 42 web routes (admin dashboard)
├── settings.php                   # Profile & security settings routes
└── console.php

config/
├── sanctum.php                    # API token config
├── fortify.php                    # Auth features config
└── ...
```

---

## Route Summary

| Category | Count |
|---|---|
| Web (Admin Dashboard) | 42 routes |
| API (Public) | 14 routes |
| API (Authenticated) | 14 routes |
| Auth (Fortify) | 20 routes |
| System | 18 routes |
| **Total** | **108 routes** |
