<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Blog;
use App\Models\BlogTag;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Consultation;
use App\Models\NewsletterSubscriber;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Review;
use App\Models\Store;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
        ]);

        User::factory()->create([
            'name' => 'Niken Massy',
            'email' => 'niken@ikeo.com',
            'password' => Hash::make('password123'),
        ]);

        // Random Users
        User::factory(10)->create();

        // -------------------------
        // 1. CURATED CATEGORIES
        // -------------------------
        $categoriesData = [
            ['name' => 'Sofas & Armchairs', 'name_id' => 'Sofa & Kursi Berlengan', 'icon' => 'sofa'],
            ['name' => 'Beds', 'name_id' => 'Tempat Tidur', 'icon' => 'bed'],
            ['name' => 'Tables', 'name_id' => 'Meja', 'icon' => 'table'],
            ['name' => 'Chairs', 'name_id' => 'Kursi', 'icon' => 'chair'],
            ['name' => 'Storage', 'name_id' => 'Penyimpanan', 'icon' => 'archive'],
            ['name' => 'Lighting', 'name_id' => 'Pencahayaan', 'icon' => 'lightbulb'],
            ['name' => 'Decor', 'name_id' => 'Dekorasi', 'icon' => 'aperture'],
        ];

        $categories = [];
        foreach ($categoriesData as $c) {
            $imageUrl = match ($c['name']) {
                'Sofas & Armchairs' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
                'Beds' => 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80',
                'Tables' => 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80',
                'Chairs' => 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
                'Storage' => 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800&q=80',
                'Lighting' => 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=800&q=80',
                'Decor' => 'https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=800&q=80',
                default => 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80',
            };

            $categories[$c['name']] = Category::create([
                'name' => $c['name'],
                'name_id' => $c['name_id'],
                'slug' => Str::slug($c['name']),
                'icon' => $c['icon'],
                'description' => 'Beautiful '.$c['name'].' for your scandinavian home.',
                'description_id' => 'Koleksi '.$c['name_id'].' bergaya Skandinavian.',
                'image' => $imageUrl,
            ]);
        }

        // -------------------------
        // 2. CURATED BRANDS
        // -------------------------
        $brandsData = [
            ['name' => 'IKEA', 'logo' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ikea_logo.svg/512px-Ikea_logo.svg.png'],
            ['name' => 'Nordiska', 'logo' => 'https://images.unsplash.com/photo-1581428982868-e410dd147a90?w=100&q=80'],
            ['name' => 'ScandiHome', 'logo' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&q=80'],
            ['name' => 'JYSK', 'logo' => 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&q=80'],
        ];

        $brands = [];
        foreach ($brandsData as $b) {
            $brands[$b['name']] = Brand::create([
                'name' => $b['name'],
                'slug' => Str::slug($b['name']),
                'logo' => $b['logo'],
                'description' => 'Premium scandinavian brand.',
            ]);
        }

        // -------------------------
        // 3. CURATED PRODUCTS
        // -------------------------
        $productsData = [
            [
                'name' => 'KIVIK Sofa',
                'category' => 'Sofas & Armchairs',
                'brand' => 'IKEA',
                'price' => 5500000,
                'image' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
                'material' => 'Cotton, Polyester',
                'weight' => 45.0,
                'dimensions' => '228x95x83 cm',
                'is_bestseller' => true,
                'description' => 'Enjoy super comfort with KIVIK sofa. A broad, deep seat with a soft, sink-in feel.',
                'description_id' => 'Nikmati kenyamanan maksimal dengan sofa KIVIK. Dudukan yang lebar dan dalam dengan pelukan lembut.',
            ],
            [
                'name' => 'STRANDMON Wing Chair',
                'category' => 'Sofas & Armchairs',
                'brand' => 'IKEA',
                'price' => 2999000,
                'image' => 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
                'material' => 'Velvet',
                'weight' => 20.0,
                'dimensions' => '82x96x101 cm',
                'is_bestseller' => false,
                'description' => 'A classic piece that brings an elegant vintage look into your living room.',
                'description_id' => 'Karya klasik yang menghadirkan tampilan vintage elegan ke ruang tamu Anda.',
            ],
            [
                'name' => 'LISABO Table',
                'category' => 'Tables',
                'brand' => 'Nordiska',
                'price' => 2499000,
                'image' => 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80',
                'material' => 'Ash veneer',
                'weight' => 15.0,
                'dimensions' => '140x78x74 cm',
                'is_bestseller' => true,
                'description' => 'Ash veneer and solid birch table brings a warm, natural feel to your dining room.',
                'description_id' => 'Meja dengan veneer abu dan kayu birch solid menghadirkan nuansa hangat dan alami di ruang makan Anda.',
            ],
            [
                'name' => 'MALM Bed frame',
                'category' => 'Beds',
                'brand' => 'IKEA',
                'price' => 3499000,
                'image' => 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80',
                'material' => 'Particleboard',
                'weight' => 60.0,
                'dimensions' => '160x200 cm',
                'is_bestseller' => true,
                'description' => 'A clean design that’s just as beautiful on all sides – place the bed freestanding or with the headboard against a wall.',
                'description_id' => 'Desain bersih yang sama indahnya dari semua sisi – letakkan tempat tidur di tengah atau dengan sandaran menghadap dinding.',
            ],
            [
                'name' => 'LERSTA Reading Lamp',
                'category' => 'Lighting',
                'brand' => 'JYSK',
                'price' => 299000,
                'image' => 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
                'material' => 'Aluminum',
                'weight' => 2.5,
                'dimensions' => '131 cm height',
                'is_bestseller' => false,
                'description' => 'You easily direct the light where you want it because the lamp arm is adjustable.',
                'description_id' => 'Anda dapat mengarahkan cahaya dengan mudah ke arah yang diinginkan karena lengan lampu dapat ditekuk.',
            ],
            [
                'name' => 'KALLAX Shelving unit',
                'category' => 'Storage',
                'brand' => 'ScandiHome',
                'price' => 999000,
                'image' => 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800&q=80',
                'material' => 'Fiberboard',
                'weight' => 25.0,
                'dimensions' => '77x147 cm',
                'is_bestseller' => true,
                'description' => 'Standing or lying, against the wall or to divide the room – KALLAX series is eager to please.',
                'description_id' => 'Berdiri atau berbaring, menempel pada dinding atau untuk membagi rungan – seri KALLAX siap memenuhi kebutuhan.',
            ],
            [
                'name' => 'HEMNES 8-drawer chest',
                'category' => 'Storage',
                'brand' => 'IKEA',
                'price' => 4599000,
                'image' => 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
                'material' => 'Solid pine',
                'weight' => 42.0,
                'dimensions' => '160x96 cm',
                'is_bestseller' => false,
                'description' => 'A classic roomy chest of drawers in solid wood, with a traditional look and modern function.',
                'description_id' => 'Lemari laci klasik lapang berbahan kayu solid, dengan tampilan tradisional dan fungsi modern.',
            ],
            [
                'name' => 'POÄNG Armchair',
                'category' => 'Sofas & Armchairs',
                'brand' => 'ScandiHome',
                'price' => 1299000,
                'image' => 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
                'material' => 'Wood veneer',
                'weight' => 9.5,
                'dimensions' => '68x82x100 cm',
                'is_bestseller' => true,
                'description' => 'Layer-glued bent oak gives comfortable resilience. The high back provides good support for your neck.',
                'description_id' => 'Lenturan kayu oak yang dilapis-lapis memberi kekenyalan kursi yang nyaman. Sandaran tingginya menopang leher dengan baik.',
            ],
            [
                'name' => 'INGATORP Extendable table',
                'category' => 'Tables',
                'brand' => 'Nordiska',
                'price' => 4999000,
                'image' => 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=800&q=80',
                'material' => 'Pine',
                'weight' => 35.0,
                'dimensions' => '155/215x87 cm',
                'is_bestseller' => false,
                'description' => 'It’s quick and easy to change the size of the table to suit your different needs.',
                'description_id' => 'Mudah dan cepat untuk mengubah ukuran meja untuk menyesuaikan dengan kebutuhan yang berbeda.',
            ],
            [
                'name' => 'LOHALS Rug',
                'category' => 'Decor',
                'brand' => 'JYSK',
                'price' => 1499000,
                'image' => 'https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=800&q=80',
                'material' => 'Jute',
                'weight' => 5.0,
                'dimensions' => '200x300 cm',
                'is_bestseller' => false,
                'description' => 'A rough, organic look with subtle variations in colour and weave.',
                'description_id' => 'Tampilan kasar organik dengan variasi warna dan anyaman yang halus.',
            ],
            [
                'name' => 'GLADOM Tray table',
                'category' => 'Tables',
                'brand' => 'IKEA',
                'price' => 299000,
                'image' => 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=800&q=80',
                'material' => 'Steel',
                'weight' => 3.5,
                'dimensions' => '45x53 cm',
                'is_bestseller' => true,
                'description' => 'A tray and a table in one. Perfect for bringing snacks around.',
                'description_id' => 'Nampan dan meja jadi satu. Sempurna untuk membawa camilan ke mana saja.',
            ],
            [
                'name' => 'RÅSKOG Trolley',
                'category' => 'Storage',
                'brand' => 'IKEA',
                'price' => 599000,
                'image' => 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?auto=format&fit=crop&w=800&q=80',
                'material' => 'Steel',
                'weight' => 7.0,
                'dimensions' => '35x45x78 cm',
                'is_bestseller' => true,
                'description' => 'Fits in the smallest of spaces and can be moved to wherever you need it.',
                'description_id' => 'Muat di ruang terkecil dan mudah dipindahkan ke mana pun Anda membutuhkannya.',
            ],
            [
                'name' => 'NYMÅNE Pendant lamp',
                'category' => 'Lighting',
                'brand' => 'Nordiska',
                'price' => 699000,
                'image' => 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=800&q=80',
                'material' => 'Steel',
                'weight' => 1.5,
                'dimensions' => '40 cm diameter',
                'is_bestseller' => false,
                'description' => 'Provides good, glare-free general lighting that’s easy to direct over the dining table.',
                'description_id' => 'Memberi cahaya umum yang baik tanpa silau, mudah diarahkan ke atas meja ruang makan.',
            ],
            [
                'name' => 'LANTLIV Plant stand',
                'category' => 'Decor',
                'brand' => 'JYSK',
                'price' => 499000,
                'image' => 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
                'material' => 'Solid pine',
                'weight' => 4.0,
                'dimensions' => '74 cm height',
                'is_bestseller' => false,
                'description' => 'A plant stand makes it possible to decorate with plants everywhere in the home.',
                'description_id' => 'Rak tanaman memudahkan penataan pot-pot tanaman hias di mana saja dalam rumah.',
            ],
            [
                'name' => 'ODGER Chair',
                'category' => 'Chairs',
                'brand' => 'Nordiska',
                'price' => 1250000,
                'image' => 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
                'material' => 'Wood Plastic Composite',
                'weight' => 5.5,
                'dimensions' => '45x51x81 cm',
                'is_bestseller' => true,
                'description' => 'Comfortable to sit on thanks to the bowl-shaped seat and rounded back.',
                'description_id' => 'Nyaman diduduki berkat bentuk jok yang cekung dan punggung yang membulat.',
            ],
        ];

        $productModels = [];
        foreach ($productsData as $pd) {
            $catId = $categories[$pd['category']]->id;
            $brandId = $brands[$pd['brand']]->id;

            $p = Product::create([
                'category_id' => $catId,
                'brand_id' => $brandId,
                'name' => $pd['name'],
                'slug' => Str::slug($pd['name']),
                'description' => $pd['description'],
                'description_id' => $pd['description_id'],
                'price' => $pd['price'],
                'discount_price' => rand(0, 100) > 70 ? $pd['price'] * 0.9 : null, // 30% chance for a 10% discount
                'image' => $pd['image'],
                'stock' => rand(10, 200),
                'is_bestseller' => $pd['is_bestseller'],
                'is_featured' => rand(0, 1) == 1,
                'material' => $pd['material'],
                'dimensions' => $pd['dimensions'],
                'weight' => $pd['weight'],
            ]);
            $productModels[] = $p;

            // Create exactly 2 variants for each product
            $colors = ['Grey', 'White', 'Black', 'Oak', 'Brown'];
            ProductVariant::create([
                'product_id' => $p->id,
                'variant_name' => 'Standard',
                'color' => $colors[array_rand($colors)],
                'size' => 'Standard',
                'material' => $pd['material'],
                'sku' => strtoupper(Str::random(8)),
                'price' => $pd['price'],
                'stock' => rand(5, 50),
                'image' => $pd['image'],
                'is_active' => true,
            ]);

            ProductVariant::create([
                'product_id' => $p->id,
                'variant_name' => 'Premium',
                'color' => $colors[array_rand($colors)],
                'size' => 'Large',
                'material' => $pd['material'],
                'sku' => strtoupper(Str::random(8)),
                'price' => $pd['price'] * 1.15,
                'stock' => rand(5, 50),
                'image' => 'https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=800&q=80',
                'is_active' => true,
            ]);

            // Create some random gallery images
            ProductImage::factory(2)->create([
                'product_id' => $p->id,
                'image_url' => 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
            ]);
        }

        // -------------------------
        // 4. RANDOMIZE OTHERS
        // -------------------------
        $storesData = [
            [
                'name' => 'IKEO Jakarta Selatan',
                'address' => 'Jl. TB Simatupang No. 123, Cilandak',
                'city' => 'Jakarta Selatan',
                'phone' => '+62 21 1234 5678',
                'latitude' => -6.2884,
                'longitude' => 106.8233,
                'hours_id' => 'Senin - Minggu: 10:00 - 22:00',
                'hours_en' => 'Mon - Sun: 10:00 AM - 10:00 PM',
            ],
            [
                'name' => 'IKEO Surabaya',
                'address' => 'Jl. Raya Darmo No. 456, Wonokromo',
                'city' => 'Surabaya',
                'phone' => '+62 31 9876 5432',
                'latitude' => -7.2819,
                'longitude' => 112.7378,
                'hours_id' => 'Senin - Minggu: 10:00 - 22:00',
                'hours_en' => 'Mon - Sun: 10:00 AM - 10:00 PM',
            ],
            [
                'name' => 'IKEO Bandung',
                'address' => 'Jl. Soekarno Hatta No. 789, Batununggal',
                'city' => 'Bandung',
                'phone' => '+62 22 5555 6666',
                'latitude' => -6.9175,
                'longitude' => 107.6191,
                'hours_id' => 'Senin - Minggu: 10:00 - 22:00',
                'hours_en' => 'Mon - Sun: 10:00 AM - 10:00 PM',
            ],
            [
                'name' => 'IKEO Bali',
                'address' => 'Jl. Sunset Road No. 321, Kuta',
                'city' => 'Bali',
                'phone' => '+62 361 7777 8888',
                'latitude' => -8.7184,
                'longitude' => 115.1686,
                'hours_id' => 'Senin - Minggu: 10:00 - 22:00',
                'hours_en' => 'Mon - Sun: 10:00 AM - 10:00 PM',
            ],
        ];
        foreach ($storesData as $s) {
            Store::create($s);
        }
        NewsletterSubscriber::factory(10)->create();

        // Let's create user interactions safely
        User::all()->each(function (User $user) use ($productModels) {
            // Give 50% of users addresses
            if (rand(0, 1)) {
                Address::factory(rand(1, 2))->create(['user_id' => $user->id]);
            }

            // Give all users some wishlists
            $wishlists = collect($productModels)->random(rand(1, 4));
            foreach ($wishlists as $p) {
                Wishlist::factory()->create(['user_id' => $user->id, 'product_id' => $p->id]);
            }
        });

        // Create 20 Orders — totals calculated from actual items
        Order::factory(20)->create()->each(function (Order $order) use ($productModels) {
            $randomProducts = collect($productModels)->random(rand(1, 3));
            $subtotal = 0;

            foreach ($randomProducts as $itemProduct) {
                $variant = $itemProduct->variants()->inRandomOrder()->first();
                $price = $variant ? $variant->price : $itemProduct->price;
                $quantity = rand(1, 3);
                $itemSubtotal = $price * $quantity;
                $subtotal += $itemSubtotal;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $itemProduct->id,
                    'product_variant_id' => $variant ? $variant->id : null,
                    'product_name' => $itemProduct->name,
                    'variant_name' => $variant ? $variant->variant_name : null,
                    'price' => $price,
                    'quantity' => $quantity,
                    'subtotal' => $itemSubtotal,
                ]);

                if (rand(0, 1)) {
                    if (! Review::where('user_id', $order->user_id)->where('product_id', $itemProduct->id)->exists()) {
                        Review::factory()->create([
                            'user_id' => $order->user_id,
                            'product_id' => $itemProduct->id,
                        ]);
                    }
                }
            }

            $tax = round($subtotal * 0.11); // PPN 11%
            $order->update([
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $subtotal + $order->shipping_cost + $tax,
            ]);
        });

        // Create Blogs — curated realistic content
        $admin = User::where('role', 'admin')->first();
        $blogsData = [
            [
                'title' => '5 Ways to Create a Cozy Scandinavian Living Room',
                'title_id' => '5 Cara Menciptakan Ruang Tamu Skandinavia yang Nyaman',
                'slug' => '5-ways-cozy-scandinavian-living-room',
                'category' => 'Design Tips',
                'category_id_text' => 'Tips Desain',
                'excerpt' => 'Discover how to bring warmth and simplicity into your living space with these timeless Scandinavian design principles.',
                'excerpt_id' => 'Temukan cara membawa kehangatan dan kesederhanaan ke ruang tamu Anda dengan prinsip desain Skandinavia yang abadi ini.',
                'content' => 'Scandinavian design is all about creating a space that feels warm, inviting, and effortlessly stylish. Start with a neutral color palette of whites, grays, and beiges, then layer in natural textures like wool throws and linen cushions. Choose furniture with clean lines and functional design — every piece should serve a purpose. Add warmth with wooden accents in light oak or birch, and don\'t forget the power of candlelight to create hygge. Finally, keep clutter to a minimum. A well-organized space is the cornerstone of Scandinavian living.',
                'content_id' => 'Desain Skandinavia adalah tentang menciptakan ruang yang terasa hangat, mengundang, dan bergaya tanpa usaha. Mulailah dengan palet warna netral putih, abu-abu, dan krem, lalu tambahkan tekstur alami seperti selimut wol dan bantal linen. Pilih furniture dengan garis bersih dan desain fungsional — setiap bagian harus memiliki tujuan. Tambahkan kehangatan dengan aksen kayu oak atau birch terang, dan jangan lupakan kekuatan lilin untuk menciptakan hygge. Terakhir, jaga agar tetap rapi.',
                'image' => 'https://images.unsplash.com/photo-1556228453-eec6c4ff41b9?w=800&q=80',
                'published_at' => '2026-01-15 10:00:00',
                'tags' => [['tag' => 'Scandinavian', 'tag_id' => 'Skandinavia'], ['tag' => 'Living Room', 'tag_id' => 'Ruang Tamu'], ['tag' => 'Cozy', 'tag_id' => 'Nyaman']],
            ],
            [
                'title' => 'The Rise of Sustainable Furniture in 2026',
                'title_id' => 'Kebangkitan Furniture Berkelanjutan di 2026',
                'slug' => 'rise-of-sustainable-furniture-2026',
                'category' => 'Home Trends',
                'category_id_text' => 'Tren Rumah',
                'excerpt' => 'Sustainability isn\'t just a trend — it\'s the future of furniture design. Here\'s what you need to know.',
                'excerpt_id' => 'Keberlanjutan bukan hanya tren — ini adalah masa depan desain furniture. Inilah yang perlu Anda ketahui.',
                'content' => 'As consumers become more environmentally conscious, the furniture industry is responding with innovative sustainable practices. From using FSC-certified wood to developing new materials from recycled ocean plastics, brands are rethinking every step of the production process. At IKEO, we\'ve committed to using 100% renewable materials by 2027. The shift towards sustainability isn\'t just good for the planet — it\'s creating beautiful, durable furniture that tells a story.',
                'content_id' => 'Seiring konsumen menjadi lebih sadar lingkungan, industri furniture merespons dengan praktik berkelanjutan yang inovatif. Dari menggunakan kayu bersertifikat FSC hingga mengembangkan material baru dari plastik laut daur ulang, merek memikirkan ulang setiap langkah proses produksi. Di IKEO, kami berkomitmen menggunakan 100% material terbarukan pada 2027.',
                'image' => 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
                'published_at' => '2026-02-05 10:00:00',
                'tags' => [['tag' => 'Sustainable', 'tag_id' => 'Berkelanjutan'], ['tag' => 'Eco-Friendly', 'tag_id' => 'Ramah Lingkungan'], ['tag' => 'Trends', 'tag_id' => 'Tren']],
            ],
            [
                'title' => 'How to Choose the Perfect Sofa for Your Home',
                'title_id' => 'Cara Memilih Sofa Sempurna untuk Rumah Anda',
                'slug' => 'how-to-choose-perfect-sofa',
                'category' => 'Buying Guide',
                'category_id_text' => 'Panduan Membeli',
                'excerpt' => 'A sofa is the heart of your living room. Learn how to pick one that fits your style, space, and budget.',
                'excerpt_id' => 'Sofa adalah jantung ruang tamu Anda. Pelajari cara memilih yang sesuai dengan gaya, ruang, dan anggaran Anda.',
                'content' => 'Choosing the right sofa can feel overwhelming with so many options available. Start by measuring your space carefully — a sofa that\'s too large will make the room feel cramped, while one that\'s too small will look lost. Consider the fabric: leather is durable and easy to clean, while cotton and linen offer a softer, more casual feel. Think about your lifestyle — if you have kids or pets, stain-resistant fabrics are a must. Finally, always test before you buy. Sit on it, lie on it, and make sure it feels right.',
                'content_id' => 'Memilih sofa yang tepat bisa terasa membingungkan dengan begitu banyak pilihan yang tersedia. Mulailah dengan mengukur ruang Anda dengan cermat. Pertimbangkan kain: kulit tahan lama dan mudah dibersihkan, sementara katun dan linen menawarkan nuansa yang lebih lembut. Pikirkan gaya hidup Anda — jika Anda memiliki anak atau hewan peliharaan, kain anti noda adalah keharusan.',
                'image' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
                'published_at' => '2026-02-20 10:00:00',
                'tags' => [['tag' => 'Sofa', 'tag_id' => 'Sofa'], ['tag' => 'Buying Guide', 'tag_id' => 'Panduan'], ['tag' => 'Living Room', 'tag_id' => 'Ruang Tamu']],
            ],
            [
                'title' => 'Small Space Solutions: Furniture for Compact Living',
                'title_id' => 'Solusi Ruang Kecil: Furniture untuk Hunian Kompak',
                'slug' => 'small-space-solutions-compact-living',
                'category' => 'Design Tips',
                'category_id_text' => 'Tips Desain',
                'excerpt' => 'Living in a small apartment? These clever furniture solutions will help you maximize every square meter.',
                'excerpt_id' => 'Tinggal di apartemen kecil? Solusi furniture cerdas ini akan membantu Anda memaksimalkan setiap meter persegi.',
                'content' => 'Small spaces don\'t have to feel cramped. The key is choosing furniture that multitasks. Look for beds with built-in storage, extendable dining tables, and modular shelving units. Vertical storage is your best friend — use wall-mounted shelves and hooks to free up floor space. Light colors and mirrors can also make a room feel larger than it is.',
                'content_id' => 'Ruang kecil tidak harus terasa sempit. Kuncinya adalah memilih furniture yang multifungsi. Cari tempat tidur dengan penyimpanan built-in, meja makan yang bisa diperpanjang, dan rak modular. Penyimpanan vertikal adalah sahabat terbaik Anda.',
                'image' => 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
                'published_at' => '2026-03-01 10:00:00',
                'tags' => [['tag' => 'Small Space', 'tag_id' => 'Ruang Kecil'], ['tag' => 'Storage', 'tag_id' => 'Penyimpanan'], ['tag' => 'Apartment', 'tag_id' => 'Apartemen']],
            ],
            [
                'title' => 'The Art of Minimalist Bedroom Design',
                'title_id' => 'Seni Desain Kamar Tidur Minimalis',
                'slug' => 'art-of-minimalist-bedroom-design',
                'category' => 'Design Tips',
                'category_id_text' => 'Tips Desain',
                'excerpt' => 'Transform your bedroom into a serene retreat with minimalist design principles that promote better sleep.',
                'excerpt_id' => 'Ubah kamar tidur Anda menjadi tempat peristirahatan yang tenang dengan prinsip desain minimalis yang mendukung tidur lebih baik.',
                'content' => 'A minimalist bedroom is more than just an aesthetic choice — it\'s a lifestyle decision that can improve your sleep quality. Start by decluttering ruthlessly. Keep only what you need and love. Choose a bed frame with clean lines and invest in quality bedding. Use a muted color palette of whites, soft grays, and natural wood tones. Keep surfaces clear and use hidden storage solutions.',
                'content_id' => 'Kamar tidur minimalis lebih dari sekadar pilihan estetika — ini adalah keputusan gaya hidup yang dapat meningkatkan kualitas tidur Anda. Mulailah dengan merapikan secara tegas. Simpan hanya yang Anda butuhkan dan cintai. Pilih rangka tempat tidur dengan garis bersih dan investasikan pada seprai berkualitas.',
                'image' => 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80',
                'published_at' => '2026-03-15 10:00:00',
                'tags' => [['tag' => 'Minimalist', 'tag_id' => 'Minimalis'], ['tag' => 'Bedroom', 'tag_id' => 'Kamar Tidur'], ['tag' => 'Design', 'tag_id' => 'Desain']],
            ],
        ];

        foreach ($blogsData as $bd) {
            $tags = $bd['tags'];
            unset($bd['tags']);
            $bd['author_id'] = $admin->id;
            $blog = Blog::create($bd);
            foreach ($tags as $t) {
                BlogTag::create(['blog_id' => $blog->id, 'tag' => $t['tag'], 'tag_id' => $t['tag_id']]);
            }
        }

        // Create Consultations using existing stores & users
        $existingUsers = User::where('role', 'user')->pluck('id');
        $existingStores = Store::pluck('id');
        for ($i = 0; $i < 5; $i++) {
            Consultation::create([
                'user_id' => $existingUsers->random(),
                'store_id' => $existingStores->random(),
                'name' => fake()->name(),
                'email' => fake()->safeEmail(),
                'phone' => fake()->phoneNumber(),
                'preferred_date' => fake()->dateTimeBetween('now', '+30 days')->format('Y-m-d'),
                'message' => fake()->paragraph(),
                'status' => fake()->randomElement(['pending', 'confirmed', 'completed', 'cancelled']),
            ]);
        }
    }
}
