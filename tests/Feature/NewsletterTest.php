<?php

test('can subscribe to newsletter', function () {
    $response = $this->postJson('/api/newsletter', [
        'email' => 'test@example.com',
    ]);

    $response->assertOk()
        ->assertJsonPath('message', 'Subscribed successfully');

    $this->assertDatabaseHas('newsletter_subscribers', [
        'email' => 'test@example.com',
        'is_active' => true,
    ]);
});

test('newsletter subscribe requires valid email', function () {
    $response = $this->postJson('/api/newsletter', ['email' => 'invalid']);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors('email');
});

test('newsletter subscribe is idempotent', function () {
    $this->postJson('/api/newsletter', ['email' => 'test@example.com']);
    $this->postJson('/api/newsletter', ['email' => 'test@example.com']);

    $this->assertDatabaseCount('newsletter_subscribers', 1);
});
