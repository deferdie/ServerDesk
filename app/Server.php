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
        'wants_node',
        'ip_address',
        'wants_mysql',
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
        'cronjobs',
        'services',
        'processes',
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
     * This server has many processes
     *
     * @return void
     */
    public function processes()
    {
        return $this->hasMany(Process::class);
    }
    
    /**
     * This server has many cronjobs
     *
     * @return void
     */
    public function cronjobs()
    {
        return $this->hasMany(CronJob::class);
    }
    
    /**
     * This server has many services
     *
     * @return void
     */
    public function services()
    {
        return $this->hasMany(ServerService::class, 'server_id', 'id');
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

    /**
     * Return an avaliable port from the server
     *
     * @param integer $portFrom
     * @param integer $portTo
     * @return void
     */
    public function getAvaliablePort($portFrom = 3000, $portTo = 4000)
    {
        $portAvaliable = false;
        $port = null;
        
        while($portAvaliable === false) {
            $portToCheck = rand($portFrom, $portTo);
            // Get an avaliable port from the server
            $result = $this->exec(
                'sudo lsof -i :' . $portToCheck
            );

            if (strlen($result->output) === 0) {
                $portAvaliable = true;
                $port = $portToCheck;
            }
        }

        return $port;
    }
}
