<?php

use App\Models\Store;

test('can list stores', function () {
    Store::factory()->count(3)->create();

    $response = $this->getJson('/api/stores');

    $response->assertOk()
        ->assertJsonCount(3, 'data');
});
