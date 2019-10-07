<?php

namespace App\Jobs;

use App\Application;
use phpseclib\Net\SSH2;
use phpseclib\Crypt\RSA;
use Illuminate\Bus\Queueable;
use App\SourceProviders\GitHub\GitHub;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class DeployApplication implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The application that is being deployed
     *
     * @var App\Application
     */
    public $application;
    
    /**
     * The original request to create the application
     *
     * @var App\Application
     */
    public $request;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Application $application, $request)
    {
        $this->request = $request;
        $this->application = $application;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $server = $this->application->server;

        // Connect to the server
        $ssh = new SSH2($server->ip_address);
        $key = new RSA();
        $key->loadKey($server->credential->private_key);

        try {
            if ($ssh->login('root', $key)) {
                // Create a server desk key if one does not already exist
                $ssh->exec(
                    view('scripts.provision-sshkey', [
                        'server' => $server
                    ])->render()
                );
                
                // Create the server desk directory
                $ssh->exec(
                    view('scripts.provision-applications')->render()
                );

                if ($this->application->sourceProvider->sourceProvider->name === 'GitHub') {
                    // Check if the provider is GitHub if so, add the public SSH key of not exists
                    $gitHub = new GitHub($this->application->sourceProvider);
                    $gitHub->createSSHKey($server);

                    $ssh->exec(
                        view('scripts.deployments.github-deployment', [
                            'application' => $this->application
                        ])->render()
                    );
                    
                    // Get the application type and install it
                    if ($this->application->type === 'Laravel') {
                        $ssh->exec(
                            view('scripts.deployments.install-laravel', [
                                'request' => $this->request,
                                'application' => $this->application,
                                'repositoryDirectory' => $this->application->domain,
                            ])->render()
                        );

                        // Setup the Nginx config for this site
                        $ssh->exec(
                            view('scripts.deployments.setup-nginx', [
                                'application' => $this->application,
                                'repositoryDirectory' => $this->application->domain,
                            ])->render()
                        );
                    }
                }

                // Set the application status as deployed
                $this->application->status = 'running';
                $this->application->save();
            }
        } catch (\Exception $e) {
            \Log::info($e);
        }
    }
}
