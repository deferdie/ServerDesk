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

use App\SourceProviders\BitBucket\BitBucket;
use App\Server;

Route::get('/test', function () {
    $server = Server::find(24);
    // Get an avaliable port from the server
    dd($server->getAvaliablePort());
});

Route::get('/{uri?}', function () {
    return view('welcome');
})->where('uri', '(.*)');
