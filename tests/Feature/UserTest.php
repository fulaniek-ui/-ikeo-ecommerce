<?php

use App\Models\User;

test('user can register', function () {
    $response = $this->post('/api/register', [
        'email' => 'admin_test@gmail.com',
        'password' => 'rahasia',
        'password_confirmation' => 'rahasia',
        'name' => 'admin',
    ]);

    $response->assertStatus(200)->orAssertStatus(201); // Menyesuaikan respon laravel fortify / custom
});

test('user can login', function () {
    // Pastikan user ada sebelum login
    User::factory()->create([
        'email' => 'admin2_test@gmail.com',
        'password' => bcrypt('rahasia'),
    ]);

    $response = $this->post('/api/login', [
        'email' => 'admin2_test@gmail.com',
        'password' => 'rahasia',
    ]);

    $response->assertStatus(200);
});
