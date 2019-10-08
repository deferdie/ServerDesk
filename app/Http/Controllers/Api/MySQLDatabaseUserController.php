<?php

namespace App\Http\Controllers\Api;

use App\MySQLUser;
use App\MySQLDatabase;
use App\MySQLDatabaseUser;
use App\Http\Controllers\Controller;
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
        $user = MySQLDatabaseUser::firstOrCreate([
            'mysql_database_id' => $database->id,
            'mysql_user_id' => $request->mysql_user_id,
        ]);

        return new MySQLDatabaseUserResource($user->fresh());
    }

    /**
     * Create a new database user
     *
     * @param MySQLDatabase $database
     * @param MySQLUser $user
     * @return void
     */
    public function destroy(MySQLDatabase $database, MySQLUser $user)
    {
        MySQLDatabaseUser::where([
            'mysql_database_id' => $database->id,
            'mysql_user_id' => $user->id,
        ])->delete();
    }
}
