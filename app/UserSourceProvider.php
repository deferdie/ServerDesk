<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserSourceProvider extends Model
{
    /**
     * The fillable attributes for this model
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'access_token',
        'source_provider_id',
        'source_provider_ssh_key_id',
    ];

    /**
     * A user source provider has one source provider
     *
     * @return void
     */
    public function sourceProvider()
    {
        return $this->hasOne(SourceProvider::class, 'id', 'source_provider_id');
    }
    
    /**
     * Scopes a query to a user
     *
     * @param QueryBuilder $query
     * @param integer $user
     * @return void
     */
    public function scopeUser($query, int $user)
    {
        return $query->where('user_id', $user);
    }
}
