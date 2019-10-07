<?php

namespace App\Jobs;

use App\Server;
use App\MySQLDatabase;
use Illuminate\Bus\Queueable;
use App\Events\DatabaseInstalled;
use Illuminate\Queue\SerializesModels;
use App\Events\DatabaseFailedToInstall;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class InstallDatabase implements ShouldQueue
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
        $result = $this->server->exec('mysql --execute="CREATE DATABASE ' . $this->db->name . '"');

        if ($result === false) {
            broadcast(new DatabaseFailedToInstall($this->db));
        }

        broadcast(new DatabaseInstalled($this->db));
    }

    /**
     * When the the job fails
     *
     * @return void
     */
    public function failed(\Exception $e)
    {
        $this->db->delete();
    }
}
