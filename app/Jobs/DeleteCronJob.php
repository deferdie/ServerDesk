<?php

namespace App\Jobs;

use App\Server;
use App\CronJob;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class DeleteCronJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The server to delete the job
     *
     * @var \App\Server
     */
    public $server;
    
    /**
     * The job to delete
     *
     * @var \App\Job
     */
    public $cron;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Server $server, CronJob $job)
    {
        $this->cron = $job;
        $this->server = $server;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->cron->delete();
    }
}
