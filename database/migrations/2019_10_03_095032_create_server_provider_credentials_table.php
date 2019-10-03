<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServerProviderCredentialsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_server_provider_credentials', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('server_provider_id');
            $table->string('name')->nullable();
            $table->string('key')->nullable();
            $table->string('secret')->nullable();
            $table->string('fingerprint')->nullable();
            $table->text('public_key')->nullable();
            $table->text('private_key')->nullable();
            $table->string('server_provider_key_id')->nullable();
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
        Schema::dropIfExists('server_provider_credentials');
    }
}
