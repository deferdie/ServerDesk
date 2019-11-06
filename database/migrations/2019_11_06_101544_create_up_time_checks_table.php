<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUpTimeChecksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('up_time_checks', function (Blueprint $table) {
            $table->uuid('id');
            $table->string('label');
            $table->string('domain');
            $table->unsignedInteger('port');
            $table->float('latency');
            $table->dateTime('last_online');
            $table->boolean('send_sms');
            $table->boolean('send_email');
            $table->enum('status', [
                'running',
                'stopped',
                'processing',
                'restarting'
            ]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('up_time_checks');
    }
}
