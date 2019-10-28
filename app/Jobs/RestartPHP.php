<?php

namespace App\Jobs;

use App\Server;
use App\ServerService;
use App\Events\ServerUpdated;
use App\Http\Resources\ServerResource;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class RestartPHP implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The server the application is deployed on
     *
     * @var server
     */
    protected $server;

    /**
     * The service to be restarted
     *
     * @var server
     */
    protected $service;

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
        $this->server->exec('echo "" | sudo -S service php'.$this->server->php_version.'-fpm reload');

        $this->service->status = 'running';
        $this->service->save();

        broadcast(new ServerUpdated(new ServerResource($this->server->fresh()), 'PHP Restarted'));
    }
}
