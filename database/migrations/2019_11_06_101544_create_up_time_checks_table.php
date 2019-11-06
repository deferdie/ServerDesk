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
            $table->bigIncrements('id');
            $table->unsignedInteger('user_id');
            $table->string('label');
            $table->string('domain');
            $table->unsignedInteger('port')->default(80);
            $table->boolean('send_sms')->default(false);
            $table->boolean('send_email')->default(false);
            $table->unsignedInteger('interval')->default(1);
            $table->enum('status', [
                'running',
                'stopped',
                'processing',
                'restarting'
            ])->default('stopped');
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
