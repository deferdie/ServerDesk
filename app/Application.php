<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    /**
     * The fillable attribute for this model
     *
     * @var array
     */
    protected $fillable = [
        'type',
        'domain',
        'user_id',
        'server_id',
        'git_branch',
        'directory',
        'respository',
        'deploy_form_git',
        'deployment_script',
        'user_source_provider_id',
    ];

    /**
     * The models that will be eagerloaded
     *
     * @var array
     */
    protected $with = [
        'server',
    ];

    /**
     * An application belongs to a user
     *
     * @return void
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * An application belongs a server
     *
     * @return void
     */
    public function server()
    {
        return $this->belongsTo(Server::class);
    }
    
    /**
     * An application source provider
     *
     * @return void
     */
    public function sourceProvider()
    {
        return $this->hasOne(UserSourceProvider::class, 'id', 'user_source_provider_id');
    }
}
