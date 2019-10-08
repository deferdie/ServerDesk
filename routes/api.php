<?php


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::name('api.')->namespace('Api')->group(function () {
    // Unprotected routes
    Route::group(['middleware' => 'guest:api'], function () {
        Route::namespace('Auth')->group(function () {
            Route::post('signin', 'SignInController@signIn')->name('signin');
            Route::post('register', 'RegisterController@register')->name('register');

            // Password Reset Routes...
            Route::post('password/email', 'ForgotPasswordController@sendResetLinkEmail');
            Route::post('password/reset', 'ResetPasswordController@reset');

            // Socialite Login
            Route::post('google/signin', 'GoogleSignInController@SignIn');
        });
    });

    // Protected routes
    Route::middleware('auth:api')->group(function () {
        Route::namespace('Auth')->group(function () {
            Route::get('me', 'MeController@me')->name('me');
            Route::post('logout', 'LogoutController@logout')->name('logout');
        });

        // Mysql databases users
        Route::get('servers/{server}/mysql-users', 'MySQLUserController@index')->name('server.mysql-user.index');
        Route::post('servers/{server}/mysql-user', 'MySQLUserController@store')->name('server.mysql-user.store');

        // Mysql database
        Route::post('servers/{server}/mysql', 'MySQLDatabaseController@store')->name('server.mysql.store');
        Route::delete('servers/{server}/mysql/{database}', 'MySQLDatabaseController@destroy')->name('server.mysql.destroy');

        // Servers
        Route::get('servers', 'ServerController@index')->name('server.index');
        Route::get('servers/{server}', 'ServerController@show')->name('server.show');
        Route::post('servers', 'ServerController@store')->name('server.store');

        // Server Provider plans
        Route::get('server-providers/{provider}/{creds}', 'ServerProviderPlanController@index')->name('server-provider.plans.index');
        
        // Server Providers
        Route::get('server-providers', 'ServerProviderController@index')->name('server-provider.index');
        
        // User Settings
        // User server providers
        Route::get('/user/server-providers', 'UserServerProviderCredentialController@index')->name('user.server-providers.index');
        Route::post('/user/server-providers', 'UserServerProviderCredentialController@store')->name('user.server-providers.store');
        
        // User source providers
        Route::get('/user/source-providers', 'UserSourceProviderController@index')->name('user.source-providers.index');

        // Source provider connectors
        Route::post('/source-providers/connect/github', 'GitHubConnectorController@connect');

        // Applications
        Route::get('/applications', 'ApplicationController@index')->name('application.index');
        Route::post('/applications', 'ApplicationController@store')->name('application.store');
    });

    Broadcast::routes();
});
