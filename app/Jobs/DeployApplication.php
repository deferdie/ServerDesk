<?php

namespace App\Jobs;

use App\Application;
use Illuminate\Bus\Queueable;
use App\SourceProviders\GitHub\GitHub;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use App\SourceProviders\BitBucket\BitBucket;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class DeployApplication implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The application that is being deployed
     *
     * @var \App\Application
     */
    public $application;
    
    /**
     * The original request to create the application
     *
     * @var Illuminate\Http\Request
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

        try {
            // Create the server desk directory
            $server->exec(view('scripts.provision-applications')->render());

            if ($this->application->sourceProvider->sourceProvider->name === 'GitHub') {
                // Check if the provider is GitHub if so, add the public SSH key of not exists
                (new GitHub($this->application->sourceProvider))->createSSHKey($server);

                $server->exec(
                    view('scripts.deployments.github-deployment', [
                        'application' => $this->application
                    ])->render()
                );
            }
            
            if ($this->application->sourceProvider->sourceProvider->name === 'BitBucket') {
                (new BitBucket($this->application->sourceProvider))
                    ->cloneRepository($server, $this->application);
            }
                
            // Deploy Laravel
            if ($this->application->type === 'Laravel') {
                $server->exec(
                    view('scripts.deployments.install-laravel', [
                        'request' => $this->request,
                        'application' => $this->application,
                        'repositoryDirectory' => $this->application->domain,
                    ])->render()
                );

                // Setup the Nginx config for this site
                $server->exec(
                    view('scripts.deployments.setup-nginx', [
                        'application' => $this->application,
                        'repositoryDirectory' => $this->application->domain,
                    ])->render()
                );

                $this->application->deployment_script = view('scripts.apps.laravel.laravel-deploy-default', [
                    'application' => $this->application
                ])->render();
            }

            // Deploy Static HTML
            if ($this->application->type === 'Static HTML') {
                $server->exec(
                    view('scripts.deployments.install-static-html', [
                        'request' => $this->request,
                        'application' => $this->application,
                        'repositoryDirectory' => $this->application->domain,
                    ])->render()
                );

                // Setup the Nginx config for this site
                $server->exec(
                    view('scripts.deployments.setup-nginx', [
                        'application' => $this->application,
                        'repositoryDirectory' => $this->application->domain,
                    ])->render()
                );

                $this->application->deployment_script = view('scripts.apps.static-html.static-html-deploy-default', [
                    'application' => $this->application
                ])->render();

                $server->exec("sudo systemctl restart nginx");
            }

            // Set the application status as deployed
            $this->application->status = 'running';
            $this->application->save();
        } catch (\Exception $e) {
            \Log::info($e);
        }
    }
}
