<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    /**
     * The fillable attributes for this model
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'active',
    ];
}
