<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use App\Application;
use App\Notifications\ApplicationCreatedNotification;

Route::get('/test', function () {
    $app = Application::find(9);
    Notification::send($app, new ApplicationCreatedNotification($app));
});

Route::get('/{uri?}', function () {
    return view('welcome');
})->where('uri', '(.*)');
