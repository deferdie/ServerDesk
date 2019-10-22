<?php

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('server.{id}', function ($user, $id) {
    return (int) \App\Server::whereId($id)->where('user_id', $user->id)->exists();
});

Broadcast::channel('server.{id}', function ($user, $id) {
    return (int) \App\Server::whereId($id)->where('user_id', $user->id)->exists();
});

Broadcast::channel('application.{id}', function ($user, $id) {
    return (int) \App\Application::whereId($id)->where('user_id', $user->id)->exists();
});