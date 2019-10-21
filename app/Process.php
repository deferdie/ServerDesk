<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Process extends Model
{
    /**
     * The fillable attributes for this model
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'user',
        'status',
        'command',
        'server_id',
        'process_count',
        'application_id',
    ];

    /**
     * A process belongs to a server
     *
     * @return void
     */
    public function server()
    {
        return $this->belongsTo(Server::class, 'server_id', 'id');
    }

    /**
     * A process can belongs to an application
     *
     * @return void
     */
    public function application()
    {
        return $this->belongsTo(Application::class, 'application_id', 'id');
    }
}
