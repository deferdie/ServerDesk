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

Route::get('/test', function () {
    $client = new \GuzzleHttp\Client();

    $resp = $client->request('POST', 'https://bitbucket.org/site/oauth2/access_token', [
        'auth' => [
            env('BITBUCKET_CLIENT_ID'),
            env('BITBUCKET_SECRET')
        ],
        'form_params' => [
            'grant_type' => 'authorization_code',
        ]
    ]);

    \Log::info($resp->getBody()->getContents());
});

Route::get('/{uri?}', function () {
    return view('welcome');
})->where('uri', '(.*)');
