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

use App\Application;
use App\Notifications\ApplicationCreatedNotification;
use App\User;

Route::get('servers/{server}/services', '\App\Http\Controllers\Api\ServerServiceController@index')->name('server.services');
Route::get('/test', function () {
});

Route::get('/{uri?}', function () {
    return view('welcome');
})->where('uri', '(.*)');
