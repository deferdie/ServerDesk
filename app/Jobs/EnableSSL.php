<?php

namespace App\Jobs;

use App\Application;
use App\Events\ApplicationUpdated;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class EnableSSL implements ShouldQueue
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
        $this->application->ssl_enabled = true;
        $this->application->save();
        
        $nginxHeader = view('scripts.nginx.nginx-head', [
            'application' => $this->application
        ])->render();
        
        $nginxMain = view('scripts.nginx.nginx-main', [
            'application' => $this->application
        ])->render();

        $this->application->server->exec(
            "echo '" . $nginxHeader . "' > /etc/nginx/serverdesk/" . $this->application->domain . ".head"
        );
        
        $this->application->server->exec(
            "echo '" . $nginxMain . "' > /etc/nginx/serverdesk/" . $this->application->domain . ".main"
        );
        
        $this->application->server->exec("sudo systemctl restart nginx");

        broadcast(new ApplicationUpdated($this->application, 'Enabled SSL'));
    }
}
