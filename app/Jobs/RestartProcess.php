<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class RestartProcess implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The server where the process will be restarted
     *
     * @var \App\Server
     */
    public $server;

    /**
     * The process to be restarted
     *
     * @var \App\Process
     */
    public $process;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Server $server, Process $process)
    {
        $this->server = $server;
        $this->process = $process;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->server->exec(
            "supervisorctl start process-".$this->process->id.":*"
        );
    }
}
