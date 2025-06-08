<?php

use App\Http\Controllers\LifehubController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
Route::apiResource('task',TaskController::class);
Route::apiResource('lifehub', LifehubController::class);
