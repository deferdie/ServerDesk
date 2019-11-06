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
        'interval',
        'send_sms',
        'send_email',
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

    /**
     * An uptime check has many uptime check histories
     *
     * @return void
     */
    public function history()
    {
        return $this->hasMany(UpTimeCheckHistory::class);
    }
}
