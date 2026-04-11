<?php

use App\Models\Store;

test('can book consultation', function () {
    $store = Store::factory()->create();

    $response = $this->postJson('/api/consultations', [
        'store_id' => $store->id,
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => '08123456789',
        'preferred_date' => now()->addDays(3)->toDateString(),
        'message' => 'I need help with furniture',
    ]);

    $response->assertCreated()
        ->assertJsonPath('message', 'Consultation booked');

    $this->assertDatabaseHas('consultations', ['email' => 'john@example.com']);
});

test('consultation requires valid fields', function () {
    $response = $this->postJson('/api/consultations', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'email', 'phone', 'preferred_date']);
});

test('consultation preferred_date must be after today', function () {
    $response = $this->postJson('/api/consultations', [
        'name' => 'John',
        'email' => 'john@example.com',
        'phone' => '08123456789',
        'preferred_date' => now()->subDay()->toDateString(),
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors('preferred_date');
});
