<?php

namespace App\Console\Commands;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Console\Command;

class UpdateImagesCommand extends Command
{
    protected $signature = 'app:update-images';

    protected $description = 'Updates all categories and products with high-quality furniture images from Unsplash.';

    public function handle()
    {
        $this->info('Starting IKEO Premium Image Update...');

        // 1. Update Categories
        $categoryImages = [
            'Sofas & Armchairs' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
            'Beds' => 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80',
            'Tables' => 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80',
            'Chairs' => 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
            'Storage' => 'https://images.unsplash.com/photo-1595514535215-8a4fa58e0a13?auto=format&fit=crop&w=800&q=80',
            'Lighting' => 'https://images.unsplash.com/photo-1513506003901-1e6a229e9d15?auto=format&fit=crop&w=800&q=80',
            'Decor' => 'https://images.unsplash.com/photo-1558211583-d26f610b1ebb?auto=format&fit=crop&w=800&q=80',
        ];

        foreach ($categoryImages as $name => $url) {
            Category::where('name', $name)->update(['image' => $url]);
        }
        $this->info('Categories updated.');

        // 2. Update Brands
        Brand::where('name', 'IKEA')->update(['logo' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ikea_logo.svg/512px-Ikea_logo.svg.png']);
        Brand::where('name', 'Nordiska')->update(['logo' => 'https://images.unsplash.com/photo-1581428982868-e410dd147a90?w=100&q=80']);
        Brand::where('name', 'ScandiHome')->update(['logo' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&q=80']);
        Brand::where('name', 'JYSK')->update(['logo' => 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&q=80']);
        $this->info('Brands updated.');

        // 3. Update Specific Curated Products
        $productImages = [
            'KIVIK Sofa' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
            'STRANDMON Wing Chair' => 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
            'LISABO Table' => 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80',
            'MALM Bed frame' => 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80',
            'LERSTA Reading Lamp' => 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
            'KALLAX Shelving unit' => 'https://images.unsplash.com/photo-1595514535215-8a4fa58e0a13?auto=format&fit=crop&w=800&q=80',
            'HEMNES 8-drawer chest' => 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
            'POÄNG Armchair' => 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
            'INGATORP Extendable table' => 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=800&q=80',
            'LOHALS Rug' => 'https://images.unsplash.com/photo-1558211583-d26f610b1ebb?auto=format&fit=crop&w=800&q=80',
            'GLADOM Tray table' => 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=800&q=80',
            'RÅSKOG Trolley' => 'https://images.unsplash.com/photo-1583847268964-b28ce8fba18e?auto=format&fit=crop&w=800&q=80',
            'NYMÅNE Pendant lamp' => 'https://images.unsplash.com/photo-1513506003901-1e6a229e9d15?auto=format&fit=crop&w=800&q=80',
            'LANTLIV Plant stand' => 'https://images.unsplash.com/photo-1416879598555-22d71fa5113d?auto=format&fit=crop&w=800&q=80',
            'ODGER Chair' => 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
        ];

        foreach ($productImages as $name => $url) {
            Product::where('name', $name)->update(['image' => $url]);
            ProductVariant::whereHas('product', function ($q) use ($name) {
                $q->where('name', $name);
            })
                ->where('variant_name', 'Standard')
                ->update(['image' => $url]);
        }

        // 4. Update Random / Catch-all Products
        Product::all()->each(function ($p) use ($categoryImages) {
            if (empty($p->image) || str_contains($p->image, 'placeholder')) {
                $catName = $p->category->name ?? '';
                if (isset($categoryImages[$catName])) {
                    $p->update(['image' => $categoryImages[$catName]]);
                }
            }
        });

        $this->info('Products and Variants updated with matching photos.');
        $this->info('Done! All images are now high-quality and consistent.');
    }
}
