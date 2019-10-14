<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ServerService extends Model
{
    /**
     * The fillable attributes for this model
     *
     * @var array
     */
    protected $fillable = [
        'service_id',
        'server_id',
        'status',
    ];

    /**
     * The provider the credientials belongs to
     *
     * @var array
     */
    protected $with = [
        'service',
    ];

    /**
     * A server service has one service
     *
     * @return void
     */
    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id', 'id');
    }
}
