<?php

namespace App\Jobs;

use App\Events\ServerUpdated;
use App\Http\Resources\ServerResource;
use App\Server;
use App\ServerService;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class InstallNodeJS implements ShouldQueue
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
        $this->server->exec(
            view('scripts.deployments.install-nodejs')->render()
        );

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

        broadcast(new ServerUpdated(new ServerResource($this->server->fresh())));
    }
}
