<?php

namespace App\Http\Controllers\Api;

use App\Server;
use App\Application;
use App\Http\Controllers\Controller;
use App\Http\Resources\ApplicationResource;
use App\Http\Requests\ApplicationStoreRequest;
use App\Jobs\DeployApplication;
use App\UserSourceProvider;

class ApplicationController extends Controller
{
    /**
     * Show all of the users applications
     *
     * @return void
     */
    public function index()
    {
        return ApplicationResource::collection(
            Application::where('user_id', auth()->user()->id)->get()
        );
    }
    
    /**
     * Create an application
     *
     * @return void
     */
    public function store(ApplicationStoreRequest $request)
    {
        $user = auth()->user();

        // Get the server
        $server = Server::where('user_id', $user->id)->where('id', $request->server_id)->first();

        if (! $server) {
            // Thow 401 exception
            abort(401);
        }

        // Get the users desired source provider
        $provider = UserSourceProvider::user($user->id)->where('id', $request->user_source_provider_id)->first();

        if (! $provider) {
            // Thow 401 exception
            abort(401);
        }

        $application = Application::create($request->all() + [
            'user_id' => $user->id
        ]);

        DeployApplication::dispatch($application->fresh());

        return new ApplicationResource($application);
    }
}