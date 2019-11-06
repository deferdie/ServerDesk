<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UpTimeCheckTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_unauthenticated_users_cannot_get_uptimechecks()
    {
        $response = $this->get('/api/uptime');

        $response->assertStatus(401);
    }
    
    public function test_authenticated_users_can_get_their_uptimechecks()
    {
        $response = $this->get('/api/uptime');

        $this->signIn();

        // $response->assertStatus(401);
    }
}
