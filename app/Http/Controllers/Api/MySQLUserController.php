<?php

namespace App\Http\Controllers\Api;

use App\Server;
use App\MySQLUser;
use App\Jobs\DeleteDatabaseUser;
use App\Jobs\InstallDatabaseUser;
use App\Http\Controllers\Controller;
use App\Http\Resources\MySQLUserResource;
use App\Http\Requests\MySQLUserStoreRequest;

class MySQLUserController extends Controller
{
    /**
     * Get all users for a given server
     *
     * @return void
     */
    public function index(Server $server)
    {
        return MySQLUserResource::collection(
            MySQLUser::where('server_id', $server->id)->get()
        );
    }
    
    /**
     * Create a mysql user for a given server
     *
     * @return void
     */
    public function store(Server $server, MySQLUserStoreRequest $request)
    {
        $user = MySQLUser::create([
            'name' => $request->name,
            'server_id' => $server->id
        ]);

        InstallDatabaseUser::dispatch($user, $request->password);

        return new MySQLUserResource($user);
    }

    /**
     * Deletes a user from the database
     *
     * @param MySQLUser $user
     * @return void
     */
    public function destroy(Server $server, MySQLUser $user)
    {
        // Delete all of the Database user records
        DeleteDatabaseUser::dispatch($user);
    }
}
