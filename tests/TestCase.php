<?php

namespace Tests;

use App\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * Authenticates the user and returns a token
     *
     * @param User $user
     * @return string
     */
    public function signIn(User $user = null)
    {
        $user = $user ?? factory('App\User')->create();

        $token = auth()->attempt([
            'email' => $user->email,
            'password' => 'secret',
        ]);

        $user->token = $token;

        return $user;
    }

    /**
     * Makes an authenticated GET request
     *
     * @param string $token
     * @param string $uri
     * @param array $params
     * @return void
     */
    public function makeGet(string $token, string $uri, array $params = [])
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson($uri, $params);

        return $response;
    }
    
    /**
     * Makes an authenticated POST request
     *
     * @param string $token
     * @param string $uri
     * @param array $params
     * @return void
     */
    public function makePost(string $token, string $uri, array $params = [])
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson($uri, $params);

        return $response;
    }
    
    /**
     * Makes a authenticated PUT request
     *
     * @param string $token
     * @param string $uri
     * @param array $params
     * @return void
     */
    public function makePut(string $token, string $uri, array $params = [])
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson($uri, $params);

        return $response;
    }
    
    /**
     * Makes a authenticated DELETE request
     *
     * @param string $token
     * @param string $uri
     * @param array $params
     * @return void
     */
    public function makeDelete(string $token, string $uri, array $params = [])
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson($uri, $params);

        return $response;
    }
}
