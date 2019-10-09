<?php

namespace App\Jobs;

use App\PublicKey;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class InstallPublicKey implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The key that should be installed
     *
     * @param PublicKey $key
     */
    public $key;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(PublicKey $key)
    {
        $this->key = $key;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->key->server->exec(view('scripts.deployments.install-public-key', [
            'key' => $this->key
        ])->render());
    }
}
