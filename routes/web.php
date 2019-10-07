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

use App\Events\ServerUpdated;
use App\Server;

Route::get('/test', function () {
    return new \App\Mail\ServerCreatedMail(Server::find(2), [
        'dbRootPass' => 'Hi Ferdie'
    ]);
});

Route::get('/{uri?}', function () {
    return view('welcome');
})->where('uri', '(.*)');
