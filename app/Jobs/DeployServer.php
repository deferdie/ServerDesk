<?php

namespace App\Jobs;

use App\User;
use App\Server;
use GuzzleHttp\Client;
use Illuminate\Support\Str;
use App\Events\ServerCreated;
use App\Events\ServerUpdated;
use Illuminate\Bus\Queueable;
use App\Events\ServerFailedToCreate;
use App\Mail\ServerCreatedMail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\ServerProviders\DigitalOcean\DigitalOcean;
use Illuminate\Support\Facades\Mail;

class DeployServer implements ShouldQueue
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

            $data = [
                'server' => $this->server,
                'dbRootPass' => Str::random(26),
                'rootPassword' => Str::random(26),
            ];

            $server = $do->droplet()->create(
                $this->server->name,
                $this->server->provider_server_region,
                $this->plan->slug, // The users selected DO plan
                'ubuntu-18-04-x64', // Image name
                false, // Enable backups
                false, // Enable IPV6
                false, // Option for private netowrking
                [$this->server->credential->server_provider_key_id],
                view('scripts.provision-ubuntu1804', $data)->render()
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

            if ($this->server->wants_php) {
                // Check if the PHP site is ready
                $siteReady = false;
                while ($siteReady === false) {
                    try {
                        $httpStatus = $client->request('GET', $this->server->ip_address . '/info.php')->getStatusCode();
                        if ($httpStatus === 200) {
                            $siteReady = true;
                        }

                        sleep(3);
                    } catch (\Exception $e) {
                        sleep(3);
                    }
                }
            }

            $this->server->status = 'running';
            $this->server->save();
            $this->server = $this->server->fresh();

            broadcast(new ServerUpdated($this->server));
            broadcast(new ServerCreated($this->server));

            // Lets send an email to the user to provide them their credentials
            Mail::to(User::find($this->server->user_id))
                ->send(new ServerCreatedMail($this->server, $data));
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
