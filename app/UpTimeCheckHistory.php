<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UpTimeCheckHistory extends Model
{
    /**
     * The fillable attributes for this model
     *
     * @var array
     */
    protected $fillable = [
        'status',
        'latency',
        'up_time_check_id',
    ];

    /**
     * An uptime check histroy belongs to an UpTimeCheck
     *
     * @return void
     */
    public function checks()
    {
        return $this->belongsTo(UpTimeCheck::class);
    }
}
