<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PublicKey extends Model
{
    /**
     * The fillable attributes for this model
     *
     * @var array
     */
    protected $fillable = [
        'key',
        'name',
        'server_id',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'key'
    ];

    /**
     * A public key belongs to a server
     *
     * @return void
     */
    public function server()
    {
        return $this->belongsTo(Server::class, 'server_id', 'id');
    }
}
