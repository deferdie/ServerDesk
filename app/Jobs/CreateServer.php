<?php

namespace App\Jobs;

use App\Server;
use GuzzleHttp\Client;
use App\Events\ServerCreated;
use App\Events\ServerFailedToCreate;
use App\Events\ServerUpdated;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\ServerProviders\DigitalOcean\DigitalOcean;

class CreateServer implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The server
     *
     * @var server
     */
    protected $server;

    /**
     * The plan
     *
     * @var object
     */
    protected $plan;

    /**
     * The provider
     *
     * @var \App\Provider
     */
    protected $provider;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Server $server, $plan, $provider)
    {
        $this->plan = $plan;
        $this->server = $server;
        $this->provider = $provider;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        if ($this->provider->name === 'Digital Ocean') {
            $do = new DigitalOcean($this->server->credential);

            $server = $do->droplet()->create(
                $this->server->name,
                $this->server->provider_server_region,
                $this->plan->slug, // The users selected DO plan
                'ubuntu-18-04-x64', // Image name
                false, // Enable backups
                false, // Enable IPV6
                false, // Option for private netowrking
                [$this->server->credential->server_provider_key_id],
                view('scripts.provision-ubuntu1804', [
                    'server' => $this->server
                ])->render()
            );

            $this->server->provider_server_id = $server->id;

            $server = $do->droplet()->waitForActive($do->droplet()->getById($server->id), 300);

            foreach ($server->networks as $network) {
                if ($network->type == 'public' && $network->version == 4) {
                    $this->server->ip_address = $network->ipAddress;
                }
                break;
            }

            // Check if the server is ready
            $client = new Client();
            $siteReady = false;
            
            while($siteReady === false) {
                try {
                    $httpStatus = $client->request('GET', $this->server->ip_address)->getStatusCode();
                    if ($httpStatus === 200) {
                        $siteReady = true;
                    }
    
                    sleep(3);
                } catch (\Exception $e) {
                    sleep(3);
                }
            }

            $this->server->status = 'running';
            $this->server = $this->server->fresh();

            broadcast(new ServerUpdated($this->server));
            broadcast(new ServerCreated($this->server));
        }
    }

    /**
     * When the the job fails
     *
     * @return void
     */
    public function failed()
    {
        broadcast(new ServerFailedToCreate($this->server->id));
        $this->server->delete();
    }
}
