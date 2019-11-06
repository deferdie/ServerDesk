<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UpTimeCheck extends Model
{
    /**
     * The fillable attributes for this model
     *
     * @var array
     */
    protected $fillable = [
        'port',
        'label',
        'domain',
        'status',
        'user_id',
        'latency',
        'interval',
        'send_sms',
        'send_email',
        'last_online',
    ];

    /**
     * An uptime check belongs to a user
     *
     * @return void
     */
    public function user()
    {
        $this->belongsTo(User::class);
    }
}
