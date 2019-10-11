<?php

use App\SSLProvider;
use Illuminate\Database\Seeder;

class SSLProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $providers = [
            "lets_encrypt" => "Let's Encrypt",
        ];

        foreach ($providers as $key => $val) {
            SSLProvider::firstOrCreate([
                'name' => $key,
                'label' => $val
            ]);
        }
    }
}
