<?php

namespace App\Jobs;

use App\MySQLDatabase;
use App\MySQLDatabaseUser;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class RemoveUserFromDatabase implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The database to remove the user from
     *
     * @var \App\MySQLDatabase
     */
    public $database;

    /**
     * The user to remove
     *
     * @var \App\MySQLDatabaseUser
     */
    public $databaseUser;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(MySQLDatabase $database, MySQLDatabaseUser $databaseUser)
    {
        $this->database = $database;
        $this->databaseUser = $databaseUser;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->database->server->exec(view('scripts.mysql.remove-user-from-database-mysql57', [
            'name' => $this->databaseUser->user->name,
            'database' => $this->database->name
        ])->render());

        $this->databaseUser->delete();
    }
}
