<?php

namespace App\Jobs;

use App\Server;
use App\Process;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class DeleteProcess implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The server where the process will be deleted
     *
     * @var \App\Server
     */
    public $server;

    /**
     * The process to be deleted
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
            "supervisorctl stop process-" . $this->process->id . ":*"
        );
        
        $this->server->exec(
            "supervisorctl remove process-" . $this->process->id
        );
        
        $this->server->exec(
            'rm /etc/supervisor/conf.d/process-' . $this->process->id . '.conf' 
        );

        $this->server->exec(
            "supervisorctl reread && supervisorctl update"
        );

        $this->process->delete();
    }
}
