<?php

namespace Tests;

use App\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    public function signIn(User $user = null)
    {
        $user = $user ?? factory('App\User')->create();

        $token = auth()->attempt([
            'email' => $user->email,
            'password' => 'secret',
        ]);

        return $token;
    }
}
