<?php

namespace App\Jobs;

use App\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class InstallSSLCert implements ShouldQueue
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
        $this->application->server->exec(
            view('scripts.deployments.install-letsencrypt', [
                'application' => $this->application
            ])->render()
        );
        
        $this->application->server->exec(
            "sudo -H /usr/local/bin/certbot-auto certonly --agree-tos --non-interactive -m ".$this->application->user->email." -d ".$this->application->domain." --nginx"
        );

        $result = $this->application->server->exec(
            "cd /etc/letsencrypt/live/" . $this->application->domain
        );

        if ($result->exitStatus > 0) {
            throw new \Exception("Failed to deploy cert");
        }

        $this->application->status = 'running';
        $this->application->save();

        EnableSSL::dispatch($this->application->fresh());
    }

    /**
     * When the job fails
     *
     * @return void
     */
    public function failed()
    {
        RemoveSSLCertSSL::dispatch($this->application);
    }
}
