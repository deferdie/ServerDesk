<?php

namespace App\Jobs;

use App\Server;
use phpseclib\Net\SSH2;
use phpseclib\Crypt\RSA;
use App\Events\ServerCreated;
use App\Events\ServerUpdated;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
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
                [$this->server->credential->server_provider_key_id]
            );

            $this->server->provider_server_id = $server->id;

            $server = $do->droplet()->getById($server->id);

            while ($server->status === 'new') {
                sleep(5);
                $server = $do->droplet()->getById($server->id);
            }

            foreach ($server->networks as $network) {
                if ($network->type == 'public' && $network->version == 4) {
                    $this->server->ip_address = $network->ipAddress;
                }
                break;
            }

            $this->server->save();
            $this->server = $this->server->fresh();

            $softwareInstalled = false;

            $ssh = new SSH2($this->server->ip_address);
            $key = new RSA();
            $key->loadKey($this->server->credential->private_key);

            while ($softwareInstalled === false) {
                try {
                    sleep(5);
                    \Log::info('installing sogftware');

                    if ($ssh->login('root', $key)) {
                        $ssh->exec(
                            view('scripts.provision-ubuntu1804', [
                                'server' => $this->server
                            ])->render()
                        );
                        $softwareInstalled = true;
                    } else {
                        \Log::info('login failed');
                    }
                } catch (\Exception $e) {
                    \Log::info($e);
                    sleep(5);
                    $softwareInstalled = false;
                }
            }

            $this->server->status = 'running';
            $this->server->save();
            $this->server = $this->server->fresh();

            broadcast(new ServerUpdated($this->server));
            broadcast(new ServerCreated($this->server));
        }
    }

    /**
     * Install the software on the server
     *
     * @return void
     */
    private function installSoftware($server)
    {
        
    }
}
