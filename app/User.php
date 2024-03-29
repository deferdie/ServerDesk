<?php

namespace App;

use App\Traits\Socialtables;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Notifications\ResetPassword as ResetPasswordNotification;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable, Socialtables;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'active',
        'is_admin',
        'password',
        'parent_user_id',
        'welcome_completed',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    /**
     * All of the users team members
     *
     * @return void
     */
    public function team()
    {
        return $this->hasMany(User::class, 'parent_user_id', 'id')->get();
    }

    /**
     * A user has many user source providers
     *
     * @return void
     */
    public function sourceProviders()
    {
        return $this->hasMany(UserSourceProvider::class);
    }
    
    /**
     * A user has many server providers
     *
     * @return void
     */
    public function serverProviders()
    {
        return $this->hasMany(UserServerProviderCredential::class);
    }

    /**
     * Return the owner for this account
     *
     * @return void
     */
    public function owner()
    {
        return $this->hasOne(User::class, 'parent_user_id', 'id');
    }
}
