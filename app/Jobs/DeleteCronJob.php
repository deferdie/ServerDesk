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
        $result = $this->cron->server->exec('cat /etc/crontab');

        $contents = $result->output;

        $stringToFind = "* * * * * root sh /root/.serverdesk/cron/$this->cron->id > /root/.serverdesk/cron/$this->cron->id.log 2>&1";
        $contents = str_replace($stringToFind, '', $contents);

        $this->cron->server->exec('echo ' . $contents . ' > /etc/crontab');

        $this->cron->server->exec("rm /root/.serverdesk/cron/" . $this->cron->id);
        $this->cron->server->exec("rm /root/.serverdesk/cron/". $this->cron->id . ".log");

        $this->cron->delete();
    }
}
