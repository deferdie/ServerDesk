<?php

namespace App\Jobs;

use App\MySQLUser;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class InstallDatabaseUser implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The database user that was created
     *
     * @var App\MySQLUser
     */
    public $user;
    
    /**
     * The password for the user
     *
     * @var App\MySQLUser
     */
    public $password;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(MySQLUser $user, string $password = null)
    {
        $this->user = $user;
        $this->password = $password;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->user->server->exec(view('scripts.mysql.create-user-mysql57', [
            'name' => $this->user->name,
            'password' => $this->password
        ])->render());
    }
}
