<?php

namespace App\Jobs;

use App\User;
use App\Server;
use GuzzleHttp\Client;
use Illuminate\Support\Str;
use App\Events\ServerCreated;
use App\Events\ServerUpdated;
use Illuminate\Bus\Queueable;
use App\Mail\ServerCreatedMail;
use Illuminate\Support\Facades\Mail;
use App\Events\ServerFailedToCreate;
use App\ServerProviders\Vultr\Vultr;
use App\Http\Resources\ServerResource;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\ServerProviders\DigitalOcean\DigitalOcean;

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
     * @var int
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
        $data = [
            'server' => $this->server,
            'dbRootPass' => Str::random(26),
            'rootPassword' => Str::random(26),
        ];

        if ($this->provider->name === 'Digital Ocean') {
            $do = new DigitalOcean($this->server->credential);

            $server = $do->createServer(
                $this->plan->slug,
                $this->server->provider_server_region,
                'ubuntu-18-04-x64',
                view('scripts.provision-ubuntu1804', $data)->render(),
                [$this->server->credential->server_provider_key_id],
                $this->server->name
            );

            $this->server->provider_server_id = $server->id;
            $this->server->save();

            // Check if the server is ready
            $server = $do->droplet()->getById($this->server->provider_server_id);

            while (in_array($server->status, ['new', 'pending'])) {
                $server = $do->droplet()->getById($this->server->provider_server_id);
                sleep(4);

                if ($server->status === 'active') {
                    break;
                }
            }

            $network = $server->networks[1];

            if ($network->type == 'public' && $network->version == 4) {
                $this->server->ip_address = $network->ipAddress;
                $this->server->save();
                $this->server = $this->server->fresh();
            }
        }

        $script = null;
        $vultr = null;

        if ($this->provider->name === 'Vultr') {
            $vultr = new Vultr($this->server->credential);

            $script = $vultr->createScript("ServerDesk provision", view('scripts.provision-ubuntu1804', $data)->render());

            $server = $vultr->createServer(
                $this->plan->VPSPLANID,
                $this->server->provider_server_region,
                $vultr->getOsId(),
                $script->SCRIPTID,
                $this->server->credential->server_provider_key_id,
                $this->server->name
            );

            $this->server->provider_server_id = $server->SUBID;

            // Check if the server is ready
            $server = $vultr->getServer($server->SUBID);

            while ($server->status == 'pending') {
                $server = $vultr->getServer($server->SUBID);
                sleep(4);
            }

            $this->server->ip_address = $server->main_ip;
            $this->server->save();
            $this->server = $this->server->fresh();
        }

        // Check if the server is ready
        $client = new Client();
        $siteReady = false;

        while ($siteReady === false) {
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

        if ($this->provider->name === 'Vultr') {
            $vultr->deleteScript($script->SCRIPTID);
        }

        $this->server->status = 'running';
        $this->server->save();
        $this->server = $this->server->fresh();

        broadcast(new ServerUpdated(new ServerResource($this->server)));
        broadcast(new ServerCreated($this->server));

        // Lets send an email to the user to provide them their credentials
        Mail::to(User::find($this->server->user_id))->send(new ServerCreatedMail($this->server, $data));
    }

    /**
     * When the the job fails
     *
     * @return void
     */
    public function failed()
    {
        $this->server = $this->server->fresh();
        broadcast(new ServerFailedToCreate($this->server->id));

        if ($this->server->provider_server_id) {
            (new DigitalOcean($this->server->credential))->deleteServer($this->server->provider_server_id);
        }

        $this->server->delete();
    }
}
