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

use App\Jobs\InstallProcess;
use App\Process;
use App\Server;

Route::get('/test', function () {
    InstallProcess::dispatch(Server::find(2), Process::find(1));
    InstallProcess::dispatch(Server::find(2), Process::find(2));
});

Route::get('/{uri?}', function () {
    return view('welcome');
})->where('uri', '(.*)');
