<?php

use App\Models\User;

test('user can register via api', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Test User',
        'email' => 'apitest@gmail.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertCreated();
    $this->assertDatabaseHas('users', ['email' => 'apitest@gmail.com']);
});

test('user can login via api', function () {
    User::factory()->create([
        'email' => 'logintest@gmail.com',
        'password' => bcrypt('password'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'logintest@gmail.com',
        'password' => 'password',
    ]);

    $response->assertOk();
    $response->assertJsonStructure(['token']);
});
