<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MySQLDatabase extends Model
{
    /**
     * The table for the model
     *
     * @var string
     */
    protected $table = 'mysql_databases';

    /**
     * The fillable attributes for this model
     */
    protected $fillable = [
        'name',
        'server_id',
    ];

    /**
     * A MySQL database belongs to a server
     *
     * @return void
     */
    public function server()
    {
        return $this->belongsTo(Server::class);
    }
}
