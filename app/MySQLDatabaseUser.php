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
        'status',
        'mysql_user_id',
        'mysql_database_id',
    ];

    /**
     * The models that will be eager loaded
     *
     * @var array
     */
    protected $with = [
        'user'
    ];

    /**
     * The database user
     *
     * @return void
     */
    public function user()
    {
        return $this->hasOne(MySQLUser::class, 'id', 'mysql_user_id');
    }
    
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
