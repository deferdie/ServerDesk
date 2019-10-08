<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MySQLUser extends Model
{
    /**
     * The table for the model
     *
     * @var string
     */
    protected $table = 'mysql_users';

    /**
     * The fillable attributes for this model
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'server_id',
    ];

    /**
     * A MySQL user belongs to a server
     *
     * @return void
     */
    public function server()
    {
        return $this->belongsTo(Server::class, 'server_id', 'id');
    }
}
