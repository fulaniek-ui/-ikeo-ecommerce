<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\DB;
use Laravel\Fortify\Features;

abstract class TestCase extends BaseTestCase
{
    protected function skipUnlessFortifyHas(string $feature, ?string $message = null): void
    {
        if (! Features::enabled($feature)) {
            $this->markTestSkipped($message ?? "Fortify feature [{$feature}] is not enabled.");
        }
    }

    protected function setUp(): void
    {
        parent::setUp();

        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('reviews')->truncate();
        DB::table('wishlists')->truncate();
        DB::table('order_items')->truncate();
        DB::table('orders')->truncate();
        DB::table('addresses')->truncate();
        DB::table('consultations')->truncate();
        DB::table('newsletter_subscribers')->truncate();
        DB::table('blog_tags')->truncate();
        DB::table('blogs')->truncate();
        DB::table('product_images')->truncate();
        DB::table('product_variants')->truncate();
        DB::table('products')->truncate();
        DB::table('categories')->truncate();
        DB::table('brands')->truncate();
        DB::table('stores')->truncate();
        DB::table('personal_access_tokens')->truncate();
        DB::table('users')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }
}
