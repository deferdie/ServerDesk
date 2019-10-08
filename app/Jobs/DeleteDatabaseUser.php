<?php

namespace App\Jobs;

use App\MySQLUser;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class DeleteDatabaseUser implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The database user that was created
     *
     * @var App\MySQLUser
     */
    public $user;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(MySQLUser $user)
    {
        $this->user = $user;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->user->server->exec(view('scripts.mysql.delete-user-mysql57', [
            'name' => $this->user->name
        ])->render());

        $this->user->delete();
    }
}
