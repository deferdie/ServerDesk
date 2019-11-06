<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UpTimeCheckTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_unauthenticated_users_cannot_get_uptimechecks()
    {
        $response = $this->get('/api/uptime');

        $response->assertStatus(401);
    }
}
