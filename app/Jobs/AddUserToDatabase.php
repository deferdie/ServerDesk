<?php

namespace App\Jobs;

use App\MySQLDatabase;
use App\MySQLDatabaseUser;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class AddUserToDatabase implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The database to add the user to
     *
     * @var \App\MySQLDatabase
     */
    public $database;

    /**
     * The user to add to the database
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
        $this->database->server->exec(view('scripts.mysql.add-user-to-database-mysql57', [
            'name' => $this->databaseUser->user->name,
            'database' => $this->database->name
        ])->render());
    }
}
