<?php

use App\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $providers = [
            'Nginx',
            'PHP-FPM'
        ];

        foreach ($providers as $provider) {
            Service::firstOrCreate([
                'name' => $provider
            ]);
        }
    }
}
