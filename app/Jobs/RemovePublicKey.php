<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class RemovePublicKey implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The key that should be removed
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
        // Get the authorised_keys contents
        $contents = $this->key->server->exec('cat ~/.ssh/authorized_keys');

        \Log::info($contents);
    }
}
