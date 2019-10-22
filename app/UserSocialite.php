<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserSocialite extends Model
{
    /**
    * Don't auto-apply mass assignment protection.
    *
    * @var array
    */
    protected $guarded = [];

    /**
     * A user socialite belongs to a User
     *
     * @return void
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
