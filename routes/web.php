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

use Pagemachine\AuthorizedKeys\AuthorizedKeys;
use Pagemachine\AuthorizedKeys\PublicKey;
use Illuminate\Support\Str;

Route::get('/test', function () {
    $authKeysPath = resource_path('views/ssh');
    $keys = AuthorizedKeys::fromFile($authKeysPath);

    // dump($encrypted);
    // dd(decrypt($encrypted));

    // dump(openssl_pkey_get_details($k));

    $key = new PublicKey($k);
    $keys->removeKey($key);
    $keys->toFile($authKeysPath);

    // Remove the comment

});

Route::get('/{uri?}', function () {
    return view('welcome');
})->where('uri', '(.*)');
