# 🪑 IKEO E-Commerce — Presentation Script
## Final Project Bootcamp | Fullstack Laravel + React

---

## SLIDE 1: Title

**IKEO — Fullstack E-Commerce Furniture Platform**

Built with Laravel 13 · React 19 · TypeScript · Inertia.js · Xendit Payment

Your Name | Final Project Bootcamp | 2026

> **Say:** "Good morning everyone. Today I'm going to present IKEO, a fullstack e-commerce platform for Scandinavian furniture that I built as my final project."

---

## SLIDE 2: What is IKEO?

**The Problem:**
- Furniture shopping online lacks good UX
- Most e-commerce sites have no design consultation feature
- Payment integration is often complex

**The Solution — IKEO:**
- Beautiful customer-facing website
- Powerful admin dashboard
- Integrated payment gateway (Xendit)
- Design consultation booking system

> **Say:** "IKEO solves the problem of furniture shopping online. It's not just a store — it has consultation booking, blog articles for inspiration, and a complete admin panel to manage everything."

---

## SLIDE 3: Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 13, PHP 8.4 |
| Frontend | React 19, TypeScript 5 |
| Bridge | Inertia.js |
| Styling | Tailwind CSS 4, shadcn/ui |
| Database | MySQL |
| Auth | Laravel Fortify (Web) + Sanctum (API) |
| Payment | Xendit Invoice API |
| Testing | Pest PHP — 105 tests ✅ |
| CI/CD | GitHub Actions |

> **Say:** "Here's the tech stack. I used Laravel 13 for the backend, React with TypeScript for the frontend, connected through Inertia.js. For payments, I integrated Xendit which is widely used in Indonesia. And I wrote 105 automated tests to ensure code quality."

---

## SLIDE 4: Project Scale

| Metric | Count |
|---|---|
| Database Models | 16 |
| Controllers | 22 |
| API Endpoints | 28 |
| Web Routes | 42 |
| React Pages | 30+ |
| Test Cases | 105 ✅ |

> **Say:** "To give you an idea of the project scale — 16 database models, 22 controllers, 28 API endpoints, over 30 React pages, and 105 test cases all passing."

---

## SLIDE 5: Database Schema

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

> **Say:** "This is the database schema. The core is the User-Product-Order relationship. Users can have addresses, wishlists, reviews, and book consultations. Products belong to categories and brands, and can have multiple variants and images."

---

## SLIDE 6: DEMO — Customer Frontend Homepage

**[LIVE DEMO: Open localhost:8000]**

Show:
- Hero section with "Shop Now" button
- Shop by Category section (7 categories with images)
- Our Brands section (4 brands with logos)
- Featured Products (8 products with prices, ratings)
- Latest Blog Articles (3 articles)
- Footer with navigation

> **Say:** "Let me show you the customer frontend. The homepage loads data from our API — categories, brands, featured products, and blog articles. Everything you see here comes from the database."

---

## SLIDE 7: DEMO — Product Catalog

**[LIVE DEMO: Click "Products" or "Shop Now"]**

Show:
- 5-column product grid (compact, professional)
- Click "Filters" — show category, brand, sort options
- Type in search box
- Show pagination
- Click a product to go to detail

> **Say:** "The product catalog shows all 15 products in a clean 5-column grid. Customers can filter by category, brand, and sort by price or name. The search works in real-time. All data comes from the REST API."

---

## SLIDE 8: DEMO — Product Detail + Reviews

**[LIVE DEMO: Click on any product]**

Show:
- Product image, name, brand, price
- Discount badge and availability status
- Product variants (if any)
- Material, dimensions, weight specs
- Scroll down to Customer Reviews section
- Star ratings from real customers
- Related products at the bottom

> **Say:** "The product detail page shows everything a customer needs — images, specs, variants with different prices, and most importantly, real customer reviews with star ratings. At the bottom, we show related products from the same category."

---

## SLIDE 9: DEMO — Blog with Related Articles

**[LIVE DEMO: Click "Blog" → Click any article]**

Show:
- Blog listing page with featured article
- Click an article
- Article content on the LEFT
- **Related Articles box on the RIGHT** (highlight this!)
- Related articles matched by same tags or category
- Tags at the bottom

> **Say:** "The blog section shows design tips and inspiration. When you open an article, notice the Related Articles box on the right side — these are automatically matched based on shared tags or the same category. This helps customers discover more content."

---

## SLIDE 10: DEMO — Store Locations

**[LIVE DEMO: Click "Stores"]**

Show:
- 8 IKEO store locations across Indonesia
- Each card shows address, phone, opening hours
- "Get Directions" button opens Google Maps
- CTA to book consultation

> **Say:** "We have 8 store locations across Indonesia — Jakarta, Bandung, Surabaya, Bali, and more. Each store card has a Get Directions button that opens Google Maps with the exact coordinates."

---

## SLIDE 11: DEMO — Consultation Booking

**[LIVE DEMO: Click "Consultation"]**

Show:
- Booking form with fields
- Store selector dropdown (data from API)
- Date picker (only future dates allowed)
- Submit the form
- Show success message

> **Say:** "Customers can book a free design consultation. They select a store, pick a date, and describe what they need help with. The booking goes directly into the database and appears in the admin dashboard."

---

## SLIDE 12: DEMO — Admin Dashboard

**[LIVE DEMO: Login as admin@ikeo.com / password]**

Show:
- Gradient hero banner with revenue stats
- Quick stat cards (categories, brands, products, reviews, etc.)
- Recent Orders with status badges
- Top Rated products with star ratings
- Low Stock alerts

> **Say:** "Now let me show the admin side. The dashboard gives a complete overview — total revenue, order count, pending orders, out of stock alerts, and top-rated products. Everything updates in real-time from the database."

---

## SLIDE 13: DEMO — Admin CRUD Operations

**[LIVE DEMO: Click through sidebar]**

Show:
- Categories list → Create/Edit form
- Products list → Show image, price, stock, category badges
- Product Variants
- Orders → Show order detail with status update
- Reviews → Moderation
- Consultations → Status management

> **Say:** "The admin can manage everything — full CRUD for categories, brands, products with variants, blog articles, and stores. Orders can be tracked and updated. Reviews can be moderated. Consultation bookings can be confirmed or completed."

---

## SLIDE 14: REST API

**28 API Endpoints:**

| Public | Authenticated |
|---|---|
| GET /api/products | POST /api/orders |
| GET /api/categories | GET /api/wishlist |
| GET /api/brands | POST /api/reviews |
| GET /api/blogs | GET /api/addresses |
| GET /api/stores | GET /api/profile |
| POST /api/consultations | POST /api/logout |
| POST /api/register | |
| POST /api/login | |

> **Say:** "The backend exposes 28 REST API endpoints. Public endpoints don't need authentication — anyone can browse products, read blogs, and book consultations. Authenticated endpoints require a Bearer token for placing orders, writing reviews, and managing wishlists."

---

## SLIDE 15: Payment Flow (Xendit)

```
Customer creates order
        ↓
Backend calculates: subtotal + 11% tax + Rp15,000 shipping
        ↓
Backend creates Xendit Invoice → gets payment URL
        ↓
Customer redirected to Xendit payment page
        ↓
Customer pays (Bank Transfer / E-Wallet)
        ↓
Xendit sends webhook → Order status: "processing"
        ↓
Admin ships order → status: "shipped" → "delivered"
```

**Validations:**
- Price cannot be zero
- Stock must be sufficient
- Amount validated before sending to Xendit

> **Say:** "For payments, I integrated Xendit. When a customer places an order, the backend calculates the total including 11% tax and shipping, creates a Xendit invoice, and redirects the customer to pay. After payment, Xendit sends a webhook to update the order status automatically."

---

## SLIDE 16: Authentication & Security

**Two auth systems:**
1. **Web (Admin)** — Laravel Fortify, session-based, 2FA support
2. **API (Customer)** — Laravel Sanctum, Bearer token

**Security measures:**
- Admin-only middleware on dashboard routes
- API login restricted to customer role only
- Ownership checks (users can only access their own data)
- Webhook token validation for Xendit
- Input validation on all endpoints
- Stock validation before order creation
- Password hashing with bcrypt

> **Say:** "Security is important. I implemented two separate auth systems — session-based for admin with 2FA support, and token-based for the API. All inputs are validated, stock is checked before orders, and the Xendit webhook is verified with a secret token."

---

## SLIDE 17: Testing

**105 Test Cases — ALL PASSED ✅**

| Area | Tests |
|---|---|
| Authentication | Login, Register, 2FA, Email Verify, Password Reset |
| Dashboard | Admin access, non-admin blocked |
| CRUD | Categories, Brands, Products, Blogs, Stores |
| API | Orders, Reviews, Wishlists, Addresses |
| Payment | Webhook PAID/EXPIRED, invalid token |
| Consultation | Booking, validation, date checks |

```bash
php artisan test
# 105 passed (303 assertions) ✅
```

> **Say:** "I wrote 105 automated tests covering authentication, CRUD operations, API endpoints, payment webhooks, and more. All 303 assertions pass. This ensures the application works correctly and prevents bugs when making changes."

---

## SLIDE 18: CI/CD

**GitHub Actions:**
- **Linter** — Runs on every push, checks code style (PHP Pint + ESLint)
- **Tests** — Runs 105 test cases automatically

> **Say:** "I set up CI/CD with GitHub Actions. Every time I push code, it automatically runs the linter and all 105 tests. This catches errors before they reach production."

---

## SLIDE 19: What I Learned

- Building a complete fullstack application from scratch
- Integrating a real payment gateway (Xendit)
- Writing comprehensive automated tests
- Designing responsive UI with React + Tailwind
- REST API design with proper validation and security
- Database design with 16 related models
- CI/CD pipeline with GitHub Actions

> **Say:** "Through this project, I learned how to build a complete production-ready application — from database design to payment integration to automated testing. These are skills I can apply directly in a professional environment."

---

## SLIDE 20: Thank You

**IKEO — Fullstack E-Commerce Furniture**

🔗 GitHub: github.com/fulaniek-ui/-ikeo-ecommerce

**Tech:** Laravel 13 · React 19 · TypeScript · Xendit · 105 Tests ✅

Questions?

> **Say:** "That's my presentation. IKEO is a fullstack e-commerce platform with a beautiful frontend, powerful admin dashboard, payment integration, and comprehensive testing. Thank you for your time. I'm happy to answer any questions."

---

## 💡 TIPS FOR PRESENTING

1. **Start with the live demo** — Show the customer frontend first, it's the most impressive
2. **Don't read slides** — Use the "Say" sections as a guide, speak naturally
3. **Show confidence** — You built this, you know it inside out
4. **Prepare for questions:**
   - "Why Xendit?" → Popular in Indonesia, good documentation, test mode available
   - "Why Inertia.js?" → Best of both worlds — Laravel backend + React frontend, no separate API needed for admin
   - "How long did it take?" → X weeks of development
   - "What was the hardest part?" → Payment integration / Testing / Database design
5. **End strong** — Mention the 105 tests, it shows professionalism
