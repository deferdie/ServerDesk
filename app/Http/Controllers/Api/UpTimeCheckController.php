<?php

namespace App\Http\Controllers\Api;

use App\UpTimeCheck;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpTimeCheckStoreRequest;
use App\Http\Resources\UpTimeCheckResource;

class UpTimeCheckController extends Controller
{
    /**
     * Show all of the uptime checks for the user
     *
     * @return void
     */
    public function index()
    {
        return UpTimeCheckResource::collection(
            UpTimeCheck::where('user_id', auth()->user()->id)->get()
        );
    }

    /**
     * Show an uptime check
     *
     * @param UpTimeCheck $uptimeCheck
     * @return void
     */
    public function show(UpTimeCheck $uptimeCheck)
    {
        return new UpTimeCheckResource($uptimeCheck);
    }
    
    /**
     * Store an uptime check
     *
     * @param UpTimeCheck $uptimeCheck
     * @return void
     */
    public function store(UpTimeCheckStoreRequest $request)
    {
        $check = UpTimeCheck::create($request->all() + [
            'user_id' => auth()->user()->id
        ]);

        return new UpTimeCheckResource($check);
    }
}
