<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateApplicationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('server_id');
            $table->unsignedInteger('user_source_provider_id')->nullable();
            $table->string('domain');
            $table->string('directory');
            $table->string('respository');
            $table->boolean('deploy_form_git')->default(true);
            $table->enum('type', [
                'PHP',
                'Laravel'
            ]);
            $table->enum('state', [
                'ready',
                'deploying'
            ])->default('deploying');
            $table->boolean('active')->default(true);
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
        Schema::dropIfExists('applications');
    }
}
