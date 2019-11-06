<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\UpTimeCheck;
use Faker\Generator as Faker;

$factory->define(UpTimeCheck::class, function (Faker $faker) {
    return [
        'port' => 80,
        'label' => $faker->name,
        'domain' => $faker->domainName,
        'status' => 'running',
        'user_id' => factory('App\User')->create()->id,
        'latency' => null,
        'send_sms' => false,
        'send_email' => false,
        'last_online' => null,
    ];
});
