<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lifehub extends Model
{
    protected $table = 'lifehubs';
    protected $casts = [
        'status' => 'integer',
    ];

    protected $fillable = [
        "name",
        "category",
        "status",
        "date"
    ];
}
