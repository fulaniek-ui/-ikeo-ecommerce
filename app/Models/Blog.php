<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Blog extends Model
{
    use HasFactory;
    protected $fillable = [
        'author_id', 'title', 'title_id', 'slug', 'excerpt', 'excerpt_id',
        'content', 'content_id', 'category', 'category_id_text', 'image', 'published_at',
    ];

    protected function casts(): array
    {
        return ['published_at' => 'datetime'];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function tags(): HasMany
    {
        return $this->hasMany(BlogTag::class);
    }
}
