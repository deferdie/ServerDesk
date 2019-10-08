<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MySQLDatabaseUser extends Model
{
    /**
     * The table for the model
     *
     * @var string
     */
    protected $table = 'mysql_database_users';

    /**
     * The fillable attributes for this model
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'mysql_database_id',
    ];

    /**
     * A database user belongs to a database
     *
     * @return void
     */
    public function database()
    {
        return $this->belongsTo(MySQLDatabase::class, 'mysql_database_id', 'id');
    }
}
