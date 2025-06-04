<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $table = 'tasks';
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
