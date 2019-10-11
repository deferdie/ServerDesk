<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(SSLProviderSeeder::class);
        $this->call(ServerProviderSeeder::class);
        $this->call(SourceProviderSeeder::class);
    }
}
