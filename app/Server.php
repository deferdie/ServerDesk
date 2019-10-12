<?php

namespace App;

use phpseclib\Net\SSH2;
use phpseclib\Crypt\RSA;
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
        'mySQLUsers',
        'publicKeys',
        'mySQLDatabase',
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
    
    /**
     * This server has many MySQL databases
     *
     * @return void
     */
    public function mySQLDatabase()
    {
        return $this->hasMany(MySQLDatabase::class);
    }
    
    /**
     * This server has many MySQL users
     *
     * @return void
     */
    public function mySQLUsers()
    {
        return $this->hasMany(MySQLUser::class);
    }
    
    /**
     * This server has many public keys
     *
     * @return void
     */
    public function publicKeys()
    {
        return $this->hasMany(PublicKey::class);
    }
    
    /**
     * This server has many applications
     *
     * @return void
     */
    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    /**
     * Runs a single command in a server
     *
     * @param string $cmd
     * @return void
     */
    public function exec(string $cmd)
    {
        $ssh = new SSH2($this->ip_address);
        $key = new RSA();
        $key->loadKey($this->credential->private_key);

        $ssh->login('root', $key);

        $result = [
            'output' => $ssh->exec($cmd),
            'exitStatus' => $ssh->getExitStatus(),
            'errorMessage' => $ssh->getStdError()
        ];

        return (object) $result;
    }
}
