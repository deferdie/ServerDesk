<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserServerProviderCredential extends Model
{
    /**
     * The fillable attributes for this model
     *
     * @var array
     */
    protected $fillable = [
        'key',
        'name',
        'secret',
        'user_id',
        'username',
        'public_key',
        'private_key',
        'fingerprint',
        'server_provider_id',
    ];

    /**
     * The provider the Credentials belongs to
     *
     * @var array
     */
    protected $with = [
        'provider'
    ];

    /**
     * The provider this Credential belongs to
     *
     * @return void
     */
    public function serverProvider()
    {
        return $this->belongsTo(ServerProvider::class);
    }

    /**
     * This server belongs to a user
     *
     * @return void
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
