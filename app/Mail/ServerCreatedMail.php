<?php

namespace App\Mail;

use App\Server;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ServerCreatedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * The server that was deployed
     *
     * @var \App\Server
     */
    public $server;
    
    /**
     * Any additional data passed when creating the server
     *
     * @var array
     */
    public $data;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Server $server, $data)
    {
        $this->data = $data;
        $this->server = $server;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.servers.created')->with([
            'data' => $this->data,
            'server' => $this->server,
        ]);
    }
}
