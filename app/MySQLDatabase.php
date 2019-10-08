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
     *
     * @var array
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

    /**
     * A database has many users
     *
     * @return void
     */
    public function database()
    {
        return $this->hasMany(MySQLDatabaseUser::class, 'mysql_database_id', 'id');
    }
}
