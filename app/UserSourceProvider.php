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
        'source_provider_id'
    ];

    /**
     * The eager loadable values
     *
     * @var array
     */
    protected $with = [
        'sourceProvider'
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
}
