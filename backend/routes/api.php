<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TransactionController;
use Illuminate\Support\Facades\Route;

Route::get('/categories', [CategoryController::class, 'list'])->name('categories.list');
Route::resource('categories', CategoryController::class)
    ->only(['store', 'show', 'update', 'destroy'])
    ->whereNumber('category');

Route::get('/transactions', [TransactionController::class, 'index']);
Route::post('/transactions', [TransactionController::class, 'store']);
Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy']);
