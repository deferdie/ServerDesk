<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which6
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/{uri?}', function () {
    return view('welcome');
})->where('uri', '(.*)');
