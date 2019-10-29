<?php

namespace App\Jobs;

use App\Server;
use App\ServerService;
use Illuminate\Support\Str;
use App\Events\ServerUpdated;
use Illuminate\Bus\Queueable;
use App\Http\Resources\ServerResource;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class InstallMySQL implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The server where NodeJS will be installed
     *
     * @var \App\Server
     */
    public $server;
    
    /**
     * The service that is being installed
     *
     * @var \App\ServerService
     */
    public $service;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Server $server, ServerService $service)
    {
        $this->server = $server;
        $this->service = $service;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $pass = Str::random(26);

        if ($this->server->mysql_version === '5.7') {
            $this->server->exec(
                view('scripts.mysql.install-mysql57', [
                    'dbRootPass' => $pass
                ])->render()
            );
        }
        // Email the new password to the user

        $this->service->status = 'running';
        $this->service->save();

        broadcast(new ServerUpdated(new ServerResource($this->server->fresh())));
    }

    /**
     * What happens if the install fails
     *
     * @return void
     */
    public function failed()
    {
        $this->service->delete();
        $this->server->wants_mysql = false;
        $this->server->mysql_version = null;
        $this->server->save();

        broadcast(new ServerUpdated(new ServerResource($this->server->fresh())));
    }
}
