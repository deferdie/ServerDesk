<?php

use App\ServerProvider;
use Illuminate\Database\Seeder;

class ServerProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $providers = [
            'Digital Ocean',
            'Vultr'
        ];

        foreach ($providers as $provider) {
            ServerProvider::firstOrCreate([
                'name' => $provider
            ]);
        }
    }
}
