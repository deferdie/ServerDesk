<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMySQLDatabaseUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mysql_database_users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('mysql_user_id');
            $table->unsignedInteger('mysql_database_id');
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
        Schema::dropIfExists('mysql_database_users');
    }
}
