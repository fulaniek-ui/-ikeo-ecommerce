# 🪑 IKEO — Presentasi Backend
### Final Project Bootcamp | Fullstack Laravel + React

---

## 1. Apa Itu IKEO?

IKEO adalah **e-commerce furniture** fullstack yang terdiri dari:
- **Frontend** — Website toko online (React)
- **Admin Panel** — Dashboard manajemen (Laravel + Inertia)
- **REST API** — Penghubung frontend & backend (Laravel Sanctum)

---

## 2. Tech Stack Backend

| Komponen         | Teknologi                        |
|------------------|----------------------------------|
| Framework        | Laravel 11                       |
| Database         | MySQL                            |
| Authentication   | Laravel Sanctum (API Token)      |
| Admin Auth       | Laravel Fortify (Session + 2FA)  |
| Payment Gateway  | Xendit (Invoice API)             |
| Testing          | Pest PHP                         |
| Deployment       | cPanel (Shared Hosting)          |

---

## 3. Struktur Database (16 Model)

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

**Tabel utama:** Users, Products, Orders, Categories, Brands, Addresses, Reviews, Wishlists, Blogs, Stores, Consultations, Newsletter Subscribers

---

## 4. Fitur API (REST API)

### 🔓 Public Endpoints (Tanpa Login)
| Method | Endpoint               | Fungsi                    |
|--------|------------------------|---------------------------|
| POST   | /api/register          | Registrasi user           |
| POST   | /api/login             | Login & dapat token       |
| GET    | /api/products          | List produk + filter/sort |
| GET    | /api/products/{slug}   | Detail produk + related   |
| GET    | /api/categories        | List kategori             |
| GET    | /api/brands            | List brand                |
| GET    | /api/blogs             | List blog                 |
| GET    | /api/stores            | List toko                 |
| POST   | /api/newsletter        | Subscribe newsletter      |
| POST   | /api/consultations     | Booking konsultasi        |

### 🔒 Authenticated Endpoints (Perlu Token)
| Method | Endpoint               | Fungsi                    |
|--------|------------------------|---------------------------|
| POST   | /api/logout            | Logout & hapus token      |
| GET    | /api/profile           | Lihat profil              |
| POST   | /api/profile           | Update profil + avatar    |
| CRUD   | /api/addresses         | Kelola alamat             |
| GET    | /api/wishlist          | Lihat wishlist            |
| POST   | /api/wishlist          | Toggle wishlist           |
| GET    | /api/orders            | Riwayat pesanan           |
| POST   | /api/orders            | Buat pesanan baru         |
| POST   | /api/reviews           | Kirim review produk       |

### 💳 Payment (Xendit)
| Method | Endpoint                    | Fungsi                  |
|--------|-----------------------------|-------------------------|
| POST   | /api/payments/webhook       | Callback dari Xendit    |
| GET    | /api/payments/{order}/check | Cek status pembayaran   |

---

## 5. Alur Pemesanan (Order Flow)

```
Customer pilih produk
        ↓
POST /api/orders (kirim items + alamat + metode bayar)
        ↓
Backend hitung subtotal + pajak 11% + ongkir Rp15.000
        ↓
Buat invoice Xendit → dapat payment_url
        ↓
Customer redirect ke halaman bayar Xendit
        ↓
Xendit kirim webhook → status order jadi "processing"
        ↓
Admin proses & kirim pesanan
```

---

## 6. Fitur Produk (Filter & Sort)

API `/api/products` mendukung:
- **Search** — cari berdasarkan nama/deskripsi/material
- **Filter** — kategori, brand, range harga, bestseller, featured
- **Sort** — terbaru, terlama, harga termurah/termahal, nama A-Z/Z-A
- **Pagination** — default 12 per halaman

---

## 7. Keamanan

- **Sanctum Token** — Setiap request authenticated pakai Bearer Token
- **Role Check** — Login API hanya untuk role `user` (bukan admin)
- **Ownership Check** — User hanya bisa akses data miliknya sendiri (address, order)
- **Webhook Token** — Xendit webhook divalidasi pakai `x-callback-token`
- **Validation** — Semua input divalidasi di controller
- **Password Hashing** — Otomatis via Laravel cast `hashed`

---

## 8. Admin Panel (Inertia + React)

Dashboard admin untuk mengelola:
- 📦 Products & Variants
- 📂 Categories & Brands
- 🛒 Orders
- ⭐ Reviews
- 📝 Blogs
- 🏪 Stores
- 📅 Consultations
- 👤 User Management

---

## 9. Unit Testing (Pest)

**Total: 63 test cases — ALL PASSED ✅**

| Test File          | Jumlah | Yang Diuji                                    |
|--------------------|--------|-----------------------------------------------|
| UserTest           | 10     | Register, login, logout, profile, validasi    |
| CategoryTest       | 3      | List, show, 404                               |
| BrandTest          | 3      | List, show, 404                               |
| ProductTest        | 6      | List, show, filter, search, 404               |
| BlogTest           | 4      | List published, show, unpublished 404          |
| StoreTest          | 1      | List stores                                   |
| NewsletterTest     | 3      | Subscribe, validasi email, idempotent         |
| ConsultationTest   | 3      | Booking, validasi field, validasi tanggal     |
| AddressTest        | 8      | CRUD, forbidden, auth, validasi               |
| WishlistTest       | 5      | List, add, toggle remove, validasi, auth      |
| OrderTest          | 6      | List, show, create (mock Xendit), forbidden   |
| ReviewTest         | 5      | Submit, duplikat, validasi rating, auth       |
| PaymentTest        | 6      | Webhook PAID/EXPIRED, invalid token, 404      |

Jalankan test:
```bash
php artisan test
```

---

## 10. Struktur Folder Backend

```
app/
├── Http/Controllers/API/    → 13 API Controller
├── Http/Controllers/        → 10 Admin Controller
├── Http/Resources/          → Product Resource & Collection
├── Models/                  → 16 Eloquent Model
├── Services/                → XenditService (Payment)
database/
├── factories/               → 16 Factory (untuk testing)
├── migrations/              → 21 Migration
├── seeders/                 → Database Seeder
tests/Feature/               → 13 Test File (63 test cases)
```

---

## Kesimpulan

IKEO adalah project fullstack e-commerce yang mencakup:
- ✅ REST API lengkap dengan authentication
- ✅ Payment gateway (Xendit)
- ✅ Admin panel dengan dashboard
- ✅ 63 unit test yang semuanya passed
- ✅ Deployment ke cPanel

---

*Dibuat dengan Laravel 11 + React + Pest PHP*
