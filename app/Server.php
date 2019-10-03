<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Server extends Model
{
    /**
     * The fillable attributes for this model
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'cpus',
        'disk',
        'memory',
        'status',
        'active',
        'user_id',
        'wants_php',
        'wants_mysql',
        'ip_address',
        'php_version',
        'mysql_version',
        'server_provider_id',
        'provider_server_id',
        'provider_server_region',
        'user_server_provider_credential_id',
    ];


    /**
     * The provider the credientials belongs to
     *
     * @var array
     */
    protected $with = [
        'serverProvider',
    ];

    /**
     * This server belongs to a user
     *
     * @return void
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * This servers credential
     *
     * @return void
     */
    public function credential()
    {
        return $this->hasOne(UserServerProviderCredential::class, 'id', 'user_server_provider_credential_id');
    }

    /**
     * This server belongs to a server provider
     *
     * @return void
     */
    public function serverProvider()
    {
        return $this->belongsTo(ServerProvider::class);
    }
}
