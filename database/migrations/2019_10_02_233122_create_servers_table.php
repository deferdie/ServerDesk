<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateServersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('servers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('server_provider_id');
            $table->unsignedInteger('user_server_provider_credential_id');
            $table->string('provider_server_id')->nullable();
            $table->string('name');

            // Server attributes
            $table->unsignedInteger('memory')->nullable();
            $table->unsignedInteger('cpus')->nullable();
            $table->unsignedInteger('disk')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->string('provider_server_region')->nullable();

            // PHP settings
            $table->boolean('wants_php')->default(false);
            $table->string('php_version')->nullable();
            $table->string('mysql_version')->nullable();

            // NodeJS settings
            $table->boolean('wants_node')->default(false);
            
            // Database settings
            $table->boolean('wants_mysql')->default(false);

            $table->boolean('active')->default(true);
            $table->enum('status', [
                'creating',
                'created',
                'deleting',
                'running',
                'stopped',
                'stopping'
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
        Schema::dropIfExists('servers');
    }
}
