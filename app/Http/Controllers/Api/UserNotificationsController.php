<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class UserNotificationsController extends Controller
{
    /**
     * Returns all of the user notifications
     *
     * @return void
     */
    public function index()
    {
        return auth()->user()->notifications()->paginate();
    }
}
