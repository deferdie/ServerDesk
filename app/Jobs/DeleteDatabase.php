<?php

namespace App\Jobs;

use App\Server;
use App\MySQLDatabase;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class DeleteDatabase implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The server to install the database
     *
     * @var \App\Server
     */
    public $server;

    /**
     * The name of the database
     *
     * @var MySQLDatabase
     */
    public $db;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Server $server, MySQLDatabase $db)
    {
        $this->server = $server;
        $this->db = $db;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->server->exec('mysql --execute="DROP DATABASE ' . $this->db->name . '"');

        $this->db->delete();
    }
}
