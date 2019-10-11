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
        $result = $this->application->server->exec(
            view('scripts.deployments.install-letsencrypt', [
                'application' => $this->application
            ])->render()
        );

        if ($result->exitStatus > 0) {
            throw new \Exception("Failed to deploy cert");
        }

        EnableSSL::dispatch($this->application);
    }
}
