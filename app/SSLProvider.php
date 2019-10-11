<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SSLProvider extends Model
{
    /**
     * The table for the model
     *
     * @var string
     */
    protected $table = 'ssl_providers';

    /**
     * The fillable attributes for this model
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'label',
        'active'
    ];
}
