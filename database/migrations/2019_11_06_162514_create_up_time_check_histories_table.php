<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUpTimeCheckHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('up_time_check_histories', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('up_time_check_id');
            $table->float('latency')->nullable();
            $table->enum('status', [
                'passed',
                'failed',
                'processing',
            ])->default('processing');
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
        Schema::dropIfExists('up_time_check_histories');
    }
}
