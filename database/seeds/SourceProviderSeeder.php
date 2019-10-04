<?php

use App\SourceProvider;
use Illuminate\Database\Seeder;

class SourceProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $providers = [
            'GitHub',
            'BitBucket'
        ];

        foreach ($providers as $provider) {
            SourceProvider::firstOrCreate([
                'name' => $provider
            ]);
        }
    }
}
