<?php

namespace App\Http\Controllers\Api;

use App\Server;
use App\MySQLDatabase;
use App\Jobs\DeleteDatabase;
use App\Jobs\InstallDatabase;
use App\Http\Controllers\Controller;
use App\Http\Resources\MySQLResource;
use App\Http\Requests\MySQLDatabaseStoreRequest;

class MySQLDatabaseController extends Controller
{
    /**
     * Creates a database for a server
     *
     * @param MySQLDatabaseStoreRequest $request
     * @return void
     */
    public function store(Server $server, MySQLDatabaseStoreRequest $request)
    {
        $db = MySQLDatabase::create([
            'name' => $request->name,
            'server_id' => $server->id
        ]);

        InstallDatabase::dispatch($server, $db);

        return new MySQLResource($db);
    }
    
    /**
     * Deletes a database
     *
     * @param MySQLDatabaseStoreRequest $request
     * @return void
     */
    public function destroy(Server $server, MySQLDatabase $database)
    {
        DeleteDatabase::dispatch($server, $database);
    }
}
