import os

factories = {
    'AddressFactory.php': r"""            'user_id' => \App\Models\User::factory(),
            'label' => fake()->randomElement(['Home', 'Work', 'Office']),
            'recipient_name' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'province' => fake()->state(),
            'postal_code' => fake()->postcode(),
            'is_default' => fake()->boolean(),""",
            
    'BrandFactory.php': r"""            'name' => fake()->company(),
            'slug' => fake()->unique()->slug(),
            'logo' => null,
            'description' => fake()->paragraph(),""",
            
    'CategoryFactory.php': r"""            'name' => fake()->word(),
            'name_id' => fake()->word(),
            'slug' => fake()->unique()->slug(),
            'icon' => null,
            'description' => fake()->sentence(),
            'description_id' => fake()->sentence(),
            'image' => null,""",
            
    'ProductFactory.php': r"""            'category_id' => \App\Models\Category::factory(),
            'brand_id' => \App\Models\Brand::factory(),
            'name' => fake()->words(3, true),
            'slug' => fake()->unique()->slug(),
            'description' => fake()->paragraph(),
            'description_id' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 10, 1000),
            'discount_price' => fake()->optional()->randomFloat(2, 5, 900),
            'image' => 'https://via.placeholder.com/640x480.png',
            'stock' => fake()->numberBetween(0, 100),
            'is_bestseller' => fake()->boolean(),
            'is_featured' => fake()->boolean(),
            'material' => fake()->word(),
            'dimensions' => fake()->randomNumber(2) . 'x' . fake()->randomNumber(2),
            'weight' => fake()->randomFloat(2, 0.5, 50),""",
            
    'ProductImageFactory.php': r"""            'product_id' => \App\Models\Product::factory(),
            'image_url' => 'https://via.placeholder.com/640x480.png',
            'sort_order' => fake()->numberBetween(0, 10),""",
            
    'ProductVariantFactory.php': r"""            'product_id' => \App\Models\Product::factory(),
            'variant_name' => fake()->word(),
            'color' => fake()->colorName(),
            'size' => fake()->randomElement(['S', 'M', 'L', 'XL']),
            'material' => fake()->word(),
            'sku' => fake()->unique()->uuid(),
            'price' => fake()->randomFloat(2, 10, 1000),
            'stock' => fake()->numberBetween(0, 100),
            'image' => null,
            'is_active' => fake()->boolean(),""",
            
    'BlogFactory.php': r"""            'author_id' => \App\Models\User::factory(),
            'title' => fake()->sentence(),
            'title_id' => fake()->sentence(),
            'slug' => fake()->unique()->slug(),
            'excerpt' => fake()->paragraph(),
            'excerpt_id' => fake()->paragraph(),
            'content' => fake()->text(1000),
            'content_id' => fake()->text(1000),
            'category' => fake()->word(),
            'category_id_text' => fake()->word(),
            'image' => null,
            'published_at' => fake()->boolean() ? fake()->dateTime() : null,""",
            
    'BlogTagFactory.php': r"""            'blog_id' => \App\Models\Blog::factory(),
            'tag' => fake()->word(),
            'tag_id' => fake()->word(),""",
            
    'StoreFactory.php': r"""            'name' => fake()->company(),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'phone' => fake()->phoneNumber(),
            'latitude' => fake()->latitude(),
            'longitude' => fake()->longitude(),
            'hours_id' => 'Senin - Jumat, 09:00 - 17:00',
            'hours_en' => 'Monday - Friday, 09:00 - 17:00',""",
            
    'ConsultationFactory.php': r"""            'user_id' => \App\Models\User::factory(),
            'store_id' => \App\Models\Store::factory(),
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'preferred_date' => fake()->date(),
            'message' => fake()->paragraph(),
            'status' => fake()->randomElement(['pending', 'confirmed', 'completed', 'cancelled']),""",
            
    'NewsletterSubscriberFactory.php': r"""            'email' => fake()->unique()->safeEmail(),
            'is_active' => fake()->boolean(),""",
            
    'OrderFactory.php': r"""            'user_id' => \App\Models\User::factory(),
            'address_id' => \App\Models\Address::factory(),
            'order_number' => fake()->unique()->bothify('ORD-####-????'),
            'status' => fake()->randomElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
            'payment_method' => fake()->randomElement(['transfer', 'ewallet']),
            'courier' => fake()->randomElement(['JNE', 'GoSend', 'SiCepat']),
            'subtotal' => fake()->randomFloat(2, 50, 5000),
            'shipping_cost' => fake()->randomFloat(2, 5, 50),
            'tax' => fake()->randomFloat(2, 5, 500),
            'total' => fake()->randomFloat(2, 100, 6000),
            'notes' => fake()->optional()->sentence(),
            'paid_at' => fake()->boolean() ? fake()->dateTime() : null,
            'shipped_at' => fake()->boolean() ? fake()->dateTime() : null,
            'delivered_at' => fake()->boolean() ? fake()->dateTime() : null,""",
            
    'OrderItemFactory.php': r"""            'order_id' => \App\Models\Order::factory(),
            'product_id' => \App\Models\Product::factory(),
            'product_variant_id' => null,
            'product_name' => fake()->words(3, true),
            'variant_name' => null,
            'price' => fake()->randomFloat(2, 10, 1000),
            'quantity' => fake()->numberBetween(1, 5),
            'subtotal' => fake()->randomFloat(2, 10, 5000),""",
            
    'ReviewFactory.php': r"""            'user_id' => \App\Models\User::factory(),
            'product_id' => \App\Models\Product::factory(),
            'rating' => fake()->numberBetween(1, 5),
            'comment' => fake()->paragraph(),""",
            
    'WishlistFactory.php': r"""            'user_id' => \App\Models\User::factory(),
            'product_id' => \App\Models\Product::factory(),""",
}

factories_dir = r"c:/laragon/www/final-project-bootcamp/database/factories"
for file_name, content in factories.items():
    path = os.path.join(factories_dir, file_name)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            file_content = f.read()
        
        target = "return [\n            //\n        ];"
        
        if target in file_content:
            file_content = file_content.replace(target, f"return [\n{content}\n        ];")
            with open(path, 'w', encoding='utf-8') as f:
                f.write(file_content)
            print(f"Updated {file_name}")
        else:
            print(f"Signature not found in {file_name}")
    else:
        print(f"File not found: {file_name}")
