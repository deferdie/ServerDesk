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
            $table->unsignedInteger('ssl_provider_id')->nullable();
            $table->string('domain');
            $table->string('directory')->nullable();
            $table->string('respository');
            $table->string('git_branch')->default('master');
            $table->boolean('deploy_form_git')->default(true);
            $table->enum('type', [
                'PHP',
                'Static HTML',
                'Laravel'
            ]);
            $table->text('deployment_script')->nullable();
            $table->enum('status', [
                'running',
                'creating',
                'deploying',
            ])->default('deploying');
            $table->boolean('ssl_enabled')->default(false);
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
