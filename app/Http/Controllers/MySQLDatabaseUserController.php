<?php

namespace App\Http\Controllers;

use App\MySQLDatabase;
use App\MySQLDatabaseUser;
use App\Http\Resources\MySQLDatabaseUserResource;
use App\Http\Requests\MySQLDatabaseUserStoreRequest;

class MySQLDatabaseUserController extends Controller
{
    /**
     * Create a new database user
     *
     * @param MySQLDatabase $database
     * @param MySQLDatabaseUserStoreRequest $request
     * @return void
     */
    public function store(MySQLDatabase $database, MySQLDatabaseUserStoreRequest $request)
    {
        $user = MySQLDatabaseUser::create([
            'name' => $request->name,
            'mysql_database_id' => $database->id
        ]);

        return new MySQLDatabaseUserResource($user);
    }
}
