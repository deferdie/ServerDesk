<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SourceProvider extends Model
{
    /**
     * The fillable attributes for this model
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'active',
    ];

    /**
     * The loadable attributes
     *
     * @var array
     */
    protected $with = [
        'userCredential'
    ];

    /**
     * A SourceProvider has one user credential
     *
     * @return void
     */
    public function userCredential()
    {
        return $this->hasOne(UserSourceProvider::class, 'source_provider_id', 'id');
    }
}
