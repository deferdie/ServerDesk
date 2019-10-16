<?php

namespace App\Jobs;

use App\Server;
use App\CronJob;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class InstallCronJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The server to install the job
     *
     * @var \App\Server
     */
    public $server;

    /**
     * The job to install
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
        $cronToInstall = "# serverdesk-".$this->cron->id."\n* * * * * root sh /root/.serverdesk/cron/".$this->cron->id." > /root/.serverdesk/cron/" . $this->cron->id . ".log 2>&1";

        // Create the directory
        $this->cron->server->exec("mkdir -p /root/.serverdesk/cron/");

        $this->cron->server->exec("touch /root/.serverdesk/cron/" . $this->cron->id);
        
        $this->cron->server->exec('echo "'.$this->cron->command.'" >> /root/.serverdesk/cron/' . $this->cron->id);

        // Make the file executable
        $this->cron->server->exec("chmod +x /root/.serverdesk/cron/" . $this->cron->id);

        // Create a log entry
        $this->cron->server->exec("touch /root/.serverdesk/cron/" . $this->cron->id . ".log");

        // Add the cron
        $this->cron->server->exec('echo "' . $cronToInstall . '" >> /etc/crontab');
    }

    /**
     * What to do if the install fails
     *
     * @return void
     */
    public function failed()
    {
        DeleteCronJob::dispatchNow($this->server, $this->job);
    }
}
