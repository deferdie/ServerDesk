<?php

namespace App\Jobs;

use App\UpTimeCheck;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class UpTimeCheckJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The check that needs to be checked
     *
     * @var \App\UpTimeCheck
     */
    public $check;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(UpTimeCheck $check)
    {
        $this->check = $check;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        
    }

    /**
     * When the job fails
     *
     * @return void
     */
    public function failed()
    {
        // Dispatch a failed boradcast for the job
    }
}
