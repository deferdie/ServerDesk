<?php

namespace App\Jobs;

use App\Process;
use App\Server;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class InstallProcess implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The server where the process will be installed
     *
     * @var \App\Server
     */
    public $server;
    
    /**
     * The process to be installed
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
            view("scripts.supervisor.install")->render()
        );
        
        $this->server->exec(
            "mkdir -p /root/.serverdesk/process/"
        );
        
        $this->server->exec(
            "touch /home/root/.serverdesk/process/process-" . $this->process->id . '.log'
        );
        
        $this->server->exec(
            'echo "' . view("scripts.supervisor.default", [
                'process' => $this->process
            ])->render() . '" > /etc/supervisor/conf.d/process-' . $this->process->id . '.conf' 
        );

        $this->server->exec(
            "supervisorctl reread && supervisorctl update"
        );

        $this->process->status = 'running';
        $this->process->save();
    }
}
