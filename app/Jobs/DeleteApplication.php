<?php

namespace App\Jobs;

use App\Application;
use Illuminate\Bus\Queueable;
use App\Events\ApplicationDeleted;
use App\Process;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class DeleteApplication implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The application that will be deleted
     *
     * @var \App\Application
     */
    public $application;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Application $application)
    {
        $this->application = $application;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Remove all of the files from the server
        $this->application->server->exec('rm -rf /var/www/html/serverdesk/' . $this->application->domain);

        // Remove all of the Nginx config
        $this->application->server->exec('rm /etc/nginx/serverdesk/'.$this->application->domain.'.head');
        $this->application->server->exec('rm /etc/nginx/serverdesk/'.$this->application->domain.'.main');
        $this->application->server->exec('rm /etc/nginx/sites-enabled/' . $this->application->domain);
        $this->application->server->exec('rm /etc/nginx/sites-available/' . $this->application->domain);

        if ($this->application->ssl_enabled) {
            $this->application->server->exec('sudo certbot delete --cert-name ' . $this->application->domain);
        }

        // Remove any application processes
        foreach ($this->application->processes as $process) {
            DeleteProcess::dispatch($this->application->server, $process);
        }

        // Reload Nginx
        $this->application->server->exec('sudo systemctl reload nginx');

        $applicationId = $this->application->id;

        $this->application->delete();

        broadcast(new ApplicationDeleted($applicationId));
    }
}
