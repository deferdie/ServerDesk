<?php

namespace App\Events;

use App\Server;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ServerCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The name of the server
     *
     * @var string
     */
    public $serverName;

    /**
     * A custom channel to broadcast on
     *
     * @var string
     */
    private $channel = null;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Server $server, $channel = null)
    {
        $this->serverName = $server->name;
        $this->channel = $channel ?? 'App.User.' . $server->user_id;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel($this->channel);
    }
}
