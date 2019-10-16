<?php

namespace App\Http\Controllers\Api;

use App\ServerProvider;
use App\ServerProviders\Vultr\Vultr;
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
        
        if ($provider->name == 'Vultr') {
            $vultr = new Vultr($creds);

            $plans = [];

            foreach (json_decode($vultr->getPlans()) as $plan) {
                array_push($plans, [
                    'name' => $plan->VPSPLANID,
                    'label' => $plan->name,
                    'active' => count($plan->available_locations) > 0,
                    'memory' => $plan->ram,
                    'cpus' => $plan->vcpu_count,
                    'disk' => $plan->disk,
                    'priceMonthly' => $plan->price_per_month,
                    'regions' => $plan->available_locations,
                ]);
            }

            return $plans;
        }
    }
}
