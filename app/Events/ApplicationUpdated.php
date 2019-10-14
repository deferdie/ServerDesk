<?php

namespace App\Events;

use App\Application;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class ApplicationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The application that will have the SSL cert
     *
     * @var \App\Application
     */
    public $application;
    
    /**
     * The message
     *
     * @var string
     */
    public $message;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Application $application, string $message = null)
    {
        $this->application = $application;
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('application.' . $this->application->id);
    }
}
