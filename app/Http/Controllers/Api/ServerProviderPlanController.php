<?php

namespace App\Http\Controllers\Api;

use App\ServerProvider;
use App\Http\Controllers\Controller;
use App\UserServerProviderCredential;
use App\ServerProviders\DigitalOcean\DigitalOcean;

class ServerProviderPlanController extends Controller
{
    /**
     * Returns all of the plans for the provider
     *
     * @param Provider $provider
     * @return void
     */
    public function index(ServerProvider $provider, UserServerProviderCredential $creds)
    {
        if ($provider->name == 'Digital Ocean') {
            $do = new DigitalOcean($creds);

            $plans = [];

            foreach ($do->size()->getAll() as $plan) {
                array_push($plans, [
                    'name' => $plan->slug,
                    'label' => $plan->slug,
                    'active' => $plan->available,
                    'memory' => $plan->memory,
                    'cpus' => $plan->vcpus,
                    'disk' => $plan->disk,
                    'priceMonthly' => $plan->priceMonthly,
                    'regions' => $plan->regions,
                ]);
            }

            return $plans;
        }
    }
}
