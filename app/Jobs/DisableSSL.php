<?php

namespace App\Jobs;

use App\Application;
use App\Events\ApplicationUpdated;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class DisableSSL implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The application that will have the SSL cert
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
        $this->application->ssl_enabled = false;
        $this->application->redirect_ssl = false;
        $this->application->save();

        $this->application = $this->application->fresh();

        $nginxBefore = view('scripts.nginx.nginx-before', [
            'application' => $this->application
        ])->render();
        
        $nginxHeader = view('scripts.nginx.nginx-head', [
            'application' => $this->application
        ])->render();

        $nginxMain = view('scripts.nginx.nginx-main', [
            'application' => $this->application
        ])->render();

        $this->application->server->exec(
            "echo '" . $nginxBefore . "' > /etc/nginx/serverdesk/" . $this->application->domain . ".before"
        );
        
        $this->application->server->exec(
            "echo '" . $nginxHeader . "' > /etc/nginx/serverdesk/" . $this->application->domain . ".head"
        );

        $this->application->server->exec(
            "echo '" . $nginxMain . "' > /etc/nginx/serverdesk/" . $this->application->domain . ".main"
        );

        $this->application->server->exec("sudo systemctl restart nginx");

        broadcast(new ApplicationUpdated($this->application, 'SSL disabled'));
    }
}
