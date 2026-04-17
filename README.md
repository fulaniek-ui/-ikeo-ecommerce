# 🪑 IKEO — Fullstack E-Commerce Furniture

> A modern fullstack e-commerce platform for Scandinavian furniture, built with **Laravel 13**, **React**, **TypeScript**, **Inertia.js**, and **Xendit Payment Gateway**.

![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Xendit](https://img.shields.io/badge/Xendit-Payment-0058A3?style=flat-square)

---

## ✨ Features

### 🛍️ Customer Frontend
- **Product Catalog** — Browse 15+ products with filters (category, brand, price), search, and sorting
- **Product Detail** — Image gallery, variants, specs, customer reviews with star ratings
- **Blog/Articles** — Design tips & inspiration with related articles sidebar
- **Store Locator** — 8 IKEO showroom locations across Indonesia with Google Maps directions
- **Consultation Booking** — Book free interior design consultations via form
- **Responsive Design** — Mobile-first, works on all devices

### 🔧 Admin Dashboard
- **Premium UI** — Gradient hero banner, colorful stat cards, animated tables
- **Full CRUD** — Categories, Brands, Products, Product Variants, Blogs, Stores
- **Order Management** — Track orders with status updates (pending → processing → shipped → delivered)
- **Review Moderation** — Monitor and manage customer reviews
- **Consultation Management** — Handle booking requests with status workflow
- **Dashboard Analytics** — Revenue, orders, stock alerts, top products, recent activity

### 💳 Payment Integration
- **Xendit Payment Gateway** — Invoice creation, payment URL redirect, webhook callbacks
- **Multiple Methods** — Bank Transfer & E-Wallet support
- **Payment Status** — Real-time status checking (polling + webhook)

### 🔐 Authentication & Security
- **Web Auth** — Laravel Fortify with session-based login, 2FA support
- **API Auth** — Laravel Sanctum with Bearer token
- **Role-based Access** — Admin dashboard protected, API restricted to customers
- **Input Validation** — All endpoints validated, stock checks, amount validation

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Laravel 13, PHP 8.4 |
| **Frontend** | React 19, TypeScript 5, Inertia.js |
| **Styling** | Tailwind CSS 4, shadcn/ui components |
| **Database** | MySQL / SQLite |
| **Auth** | Laravel Fortify (Web) + Sanctum (API) |
| **Payment** | Xendit Invoice API |
| **Testing** | Pest PHP (105 tests, 303 assertions) |
| **CI/CD** | GitHub Actions (lint + test) |

---

## 📊 Project Scale

| Metric | Count |
|---|---|
| Eloquent Models | 16 |
| Controllers | 22 (10 Admin + 12 API) |
| API Endpoints | 28 |
| Web Routes | 42 |
| Database Migrations | 20 |
| Test Cases | 105 ✅ |
| React Pages | 30+ |

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/fulaniek-ui/-ikeo-ecommerce.git
cd -ikeo-ecommerce

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Database
php artisan migrate:fresh --seed
php artisan storage:link

# Run
composer dev          # or: php artisan serve & npm run dev
```

**Default Admin Login:**
- Email: `admin@ikeo.com`
- Password: `password`

---

## 📁 Project Structure

```
app/
├── Http/Controllers/API/    → 12 REST API Controllers
├── Http/Controllers/        → 10 Admin Dashboard Controllers
├── Http/Resources/          → API Resources (Product)
├── Models/                  → 16 Eloquent Models
├── Services/                → XenditService (Payment)
├── Http/Middleware/          → CheckAdmin, Inertia, Appearance

resources/js/
├── pages/                   → 30+ React pages
│   ├── catalog/             → Product listing & detail
│   ├── blog-public/         → Blog listing & detail
│   ├── stores-public/       → Store locations
│   ├── consultation-public/ → Booking form
│   ├── category/            → Admin CRUD
│   ├── brand/               → Admin CRUD
│   ├── product/             → Admin CRUD + variants
│   ├── order/               → Admin order management
│   └── ...
├── components/              → Reusable UI components
└── layouts/                 → App & Auth layouts

tests/Feature/               → 105 Pest test cases
```

---

## 🧪 Testing

```bash
# Run all tests
php artisan test

# 105 passed (303 assertions) ✅
```

Test coverage includes: Authentication, CRUD operations, API endpoints, Payment webhook, Order flow, Review system, and more.

---

## 📱 Screenshots

| Homepage | Product Catalog | Admin Dashboard |
|---|---|---|
| Categories, Brands, Featured Products, Blog | 5-column grid, filters, search, sort | Gradient hero, stat cards, order tracking |

| Blog Detail | Store Locations | Consultation |
|---|---|---|
| Article + Related sidebar | 8 locations with Google Maps | Booking form with store selector |

---

## 🗄️ Database Schema

```
User ──┬── Address ──── Order ──── OrderItem
       ├── Wishlist                    │
       ├── Review                  Product ──┬── ProductVariant
       ├── Consultation                      ├── ProductImage
       └── Blog ── BlogTag                   ├── Category
                                             └── Brand
Store
NewsletterSubscriber
```

---

## 📄 API Documentation

Full REST API with 28 endpoints. See [BACKEND.md](BACKEND.md) for complete documentation.

**Key endpoints:**
- `POST /api/register` — User registration
- `POST /api/login` — Authentication with token
- `GET /api/products` — Product listing with filters
- `POST /api/orders` — Create order with Xendit payment
- `GET /api/blogs` — Published articles
- `POST /api/consultations` — Book consultation

---

## 👤 Author

Built as a Final Project for Fullstack Bootcamp.

---

## 📝 License

This project is open-sourced for educational and portfolio purposes.
