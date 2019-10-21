<?php

namespace App\Jobs;

use App\Application;
use App\Applications\Adonis;
use Illuminate\Bus\Queueable;
use App\Applications\Laravel;
use App\Applications\StaticHtml;
use App\SourceProviders\GitHub\GitHub;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\SourceProviders\BitBucket\BitBucket;

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
                $gitHub = new GitHub($this->application->sourceProvider);
                $gitHub->createSSHKey($server);
                $gitHub->cloneRepository($server, $this->application);
            }
            
            if ($this->application->sourceProvider->sourceProvider->name === 'BitBucket') {
                (new BitBucket($this->application->sourceProvider))
                    ->cloneRepository($server, $this->application);
            }
                
            // Deploy Laravel
            if ($this->application->type === 'Laravel') {
                Laravel::deploy($this->application, $this->request);
            }

            // Deploy Static HTML
            if ($this->application->type === 'Static HTML') {
                StaticHtml::deploy($this->application, $this->request);
            }
            
            // Deploy AdonisJS
            if ($this->application->type === 'Adonis JS') {
                Adonis::deploy($this->application, $this->request);
            }

            // Set the application status as deployed
            $this->application->status = 'running';
            $this->application->save();
        } catch (\Exception $e) {
            \Log::info($e);
        }
    }
}
