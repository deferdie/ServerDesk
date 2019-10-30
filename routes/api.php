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
            Route::get('me', 'UserController@show')->name('me');
            Route::put('user', 'UserController@update')->name('user.update');
            Route::post('logout', 'LogoutController@logout')->name('logout');
        });

        // Server Services
        Route::get('servers/{server}/services', 'ServerServiceController@index')->name('server.services.index');
        Route::post('servers/{server}/services', 'ServerServiceController@store')->name('server.services.store');
        Route::post('servers/{server}/services/{service}', 'ServerServiceController@store')->name('server.services.store');

        // Server services
        Route::post('servers/{server}/restart-service', 'ServerServiceRestartController@restart');

        // Server processes
        Route::put('servers/{server}/process/{process}', 'ServerProcessController@update');
        Route::post('servers/{server}/process', 'ServerProcessController@store');
        Route::delete('servers/{server}/process/{process}', 'ServerProcessController@destroy');
        
        // Server cron jobs
        Route::put('servers/{server}/cron-job/{job}', 'CronJobController@update');
        Route::post('servers/{server}/cron-job', 'CronJobController@store');
        Route::delete('servers/{server}/cron-job/{job}', 'CronJobController@destroy');

        // Mysql users
        Route::get('servers/{server}/mysql-users', 'MySQLUserController@index')->name('server.mysql-user.index');
        Route::post('servers/{server}/mysql-user', 'MySQLUserController@store')->name('server.mysql-user.store');
        Route::delete('servers/{server}/mysql-user/{user}', 'MySQLUserController@destroy')->name('server.mysql-user.destroy');
        
        // Mysql database users
        Route::post('/mysql/{database}/user', 'MySQLDatabaseUserController@store')->name('mysql.user.store');
        Route::delete('/mysql/{database}/user/{user}', 'MySQLDatabaseUserController@destroy')->name('mysql.user.destroy');

        // Mysql database
        Route::post('servers/{server}/mysql', 'MySQLDatabaseController@store')->name('server.mysql.store');
        Route::delete('servers/{server}/mysql/{database}', 'MySQLDatabaseController@destroy')->name('server.mysql.destroy');

        // Public keys
        Route::get('servers/{server}/public-keys', 'PublicKeyController@index')->name('server.public-key.index');
        Route::post('servers/{server}/public-key', 'PublicKeyController@store')->name('server.public-key.store');
        Route::delete('servers/{server}/public-key/{key}', 'PublicKeyController@destroy')->name('server.public-key.destroy');

        // Servers
        Route::get('servers', 'ServerController@index')->name('server.index');
        Route::get('servers/{server}', 'ServerController@show')->name('server.show');
        Route::post('servers', 'ServerController@store')->name('server.store');
        Route::delete('servers/{server}', 'ServerController@destroy')->name('server.destroy');

        // Server Provider plans
        Route::get('server-providers/{provider}/{creds}', 'ServerProviderPlanController@index')->name('server-provider.plans.index');
        
        // Server Providers
        Route::get('server-providers', 'ServerProviderController@index')->name('server-provider.index');
        
        // User Settings
        // User server providers
        Route::get('/user/server-providers', 'UserServerProviderCredentialController@index')->name('user.server-providers.index');
        Route::post('/user/server-providers', 'UserServerProviderCredentialController@store')->name('user.server-providers.store');
        Route::delete('/user/server-providers/{credential}', 'UserServerProviderCredentialController@destroy')->name('user.server-providers.destroy');
        
        // User source providers
        Route::get('/source-providers', 'SourceProviderController@index')->name('source-providers.index');
        
        // User source providers
        Route::get('/user/source-providers', 'UserSourceProviderController@index')->name('user.source-providers.index');

        // Source provider connectors
        Route::post('/source-providers/connect/github', 'GitHubConnectorController@connect');
        Route::post('/source-providers/connect/bitbucket', 'BitBucketConnectorController@connect');

        // Install SSL certificate
        Route::post('/applications/{application}/encrypt', 'ApplicationEncryptController@encrypt')->name('application.encrypt');
        Route::delete('/applications/{application}/decrypt', 'ApplicationEncryptController@decrypt')->name('application.decrypt');
        
        // Deploy application
        Route::post('/applications/{application}/deploy', 'ApplicationDeployController@deploy')->name('application.deploy');

        // Application environment
        Route::post('/applications/{application}/env', 'ApplicationEnvironmentController@show')->name('application.env.show');
        Route::put('/applications/{application}/env', 'ApplicationEnvironmentController@update')->name('application.env.update');

        // Applications
        Route::get('/applications', 'ApplicationController@index')->name('application.index');
        Route::get('/applications/{application}', 'ApplicationController@show')->name('application.show');
        Route::post('/applications', 'ApplicationController@store')->name('application.store');
        Route::put('/applications/{application}', 'ApplicationController@update')->name('application.update');
        Route::delete('/applications/{application}', 'ApplicationController@destroy')->name('application.destroy');

        // SSL providers
        Route::get('/ssl-providers', 'SSLProviderController@index')->name('ssl-provider.index');

        // The user notifications
        Route::get('/notifications', 'UserNotificationsController@index')->name('notifications');
        
        // The team for the user
        Route::get('/teams', 'TeamController@index')->name('teams');
        Route::post('/teams', 'TeamController@store')->name('teams.store');
    });

    Broadcast::routes();

    Route::get('/source-providers/connect/bitbucket/init', 'BitBucketConnectorController@init');
});
