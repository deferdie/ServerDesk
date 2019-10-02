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
    ];


    /**
     * The provider the credientials belongs to
     *
     * @var array
     */
    protected $with = [
        'serverProvider'
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
     * This server belongs to a server provider
     *
     * @return void
     */
    public function serverProvider()
    {
        return $this->belongsTo(ServerProvider::class);
    }

    /**
     * Returns the config for connecting to the server
     *
     * @return array
     */
    public function getPrivateKey($user = null)
    {
        $user = $user ?? auth()->user()->id;

        $provider = ProviderCredientials::where('server_provider_id', $this->server_provider_id)->where('user_id', $user)->first();

        return $provider->private_key;
    }
}
