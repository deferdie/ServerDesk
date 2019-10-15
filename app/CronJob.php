<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CronJob extends Model
{
    /**
     * The fillable attributes for this model
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'user',
        'cron',
        'status',
        'command',
        'server_id',
        'recurrence',
    ];

    /**
     * A cronjob belongs to a server
     *
     * @return void
     */
    public function server()
    {
        return $this->belongsTo(Server::class, 'server_id', 'id');
    }
}
