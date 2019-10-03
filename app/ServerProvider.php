<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ServerProvider extends Model
{
    /**
     * The fillable attributes for this model
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'status',
    ];
}
