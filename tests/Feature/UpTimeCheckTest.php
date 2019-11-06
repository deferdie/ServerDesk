<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Jobs\UpTimeCheckJob;
use Illuminate\Support\Facades\Bus;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UpTimeCheckTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_users_cannot_get_uptimechecks()
    {
        $response = $this->get(route('api.uptime.index'));

        $response->assertStatus(401);
    }
    
    public function test_authenticated_users_can_get_their_uptimechecks()
    {
        $user = $this->signIn();
        $checkHas = factory('App\UpTimeCheck')->create([
            'user_id' => $user->id,
            'label' => 'Ferdie'
        ]);
        
        $checkMissing = factory('App\UpTimeCheck')->create([
            'user_id' => 2,
            'label' => 'Veronia'
        ]);
                
        $response = $this->makeGet($user->token, route('api.uptime.index'));

        // Check the response
        $response->assertStatus(200)
        ->assertJsonFragment([
            'label' => $checkHas->label
        ])->assertJsonMissing([
            'label' => $checkMissing->label
        ]);
    }
    
    public function test_authenticated_users_can_show_an_uptimecheck()
    {
        $user = $this->signIn();
        $checkHas = factory('App\UpTimeCheck')->create([
            'user_id' => $user->id,
            'label' => 'Ferdie'
        ]);
        
        $checkMissing = factory('App\UpTimeCheck')->create([
            'user_id' => 2,
            'label' => 'Veronia'
        ]);
                
        $response = $this->makeGet($user->token, route('api.uptime.show', [$checkHas->id]));

        // Check the response
        $response->assertStatus(200)
        ->assertJsonFragment([
            'label' => $checkHas->label
        ]);

        $response = $this->makeGet($user->token, route('api.uptime.show', [$checkHas->id]));

        // Check the response
        $response->assertStatus(200)
        ->assertJsonMissing([
            'label' => $checkMissing->label
        ]);
    }
    
    public function test_authenticated_users_can_store_an_uptimecheck()
    {
        Bus::fake();

        $user = $this->signIn();
        $check = factory('App\UpTimeCheck')->make([
            'user_id' => $user->id,
            'label' => 'Ferdie'
        ]);

        $response = $this->makePost($user->token, route('api.uptime.store'), $check->toArray());

        $response->assertStatus(201);

        $response = $this->makeGet($user->token, route('api.uptime.show', [$check->id]));
        
        $response->assertStatus(200)->assertJsonFragment([
            'label' => $check->label
        ]);

        Bus::assertDispatched(UpTimeCheckJob::class);
    }
    
    public function test_authenticated_users_can_update_an_uptimecheck()
    {
        $user = $this->signIn();
        $check = factory('App\UpTimeCheck')->create([
            'user_id' => $user->id
        ]);

        $check->label = 'ferdie';

        $response = $this->makePut($user->token, route('api.uptime.update', [$check->id]), $check->toArray());

        $response->assertStatus(200);

        $response = $this->makeGet($user->token, route('api.uptime.show', [$check->id]));
        
        $response->assertStatus(200)->assertJsonFragment([
            'label' => 'ferdie'
        ]);
    }
    
    public function test_authenticated_users_can_delete_an_uptimecheck()
    {
        $user = $this->signIn();
        $check = factory('App\UpTimeCheck')->create([
            'user_id' => $user->id
        ]);

        $response = $this->makeDelete($user->token, route('api.uptime.delete', [$check->id]), $check->toArray());

        $response->assertStatus(200);

        $this->makeGet($user->token, route('api.uptime.show', [$check->id]))->assertStatus(404);
    }
}
