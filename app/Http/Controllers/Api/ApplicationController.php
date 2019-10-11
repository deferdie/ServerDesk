<?php

namespace App\Http\Controllers\Api;

use App\Server;
use App\Application;
use App\UserSourceProvider;
use App\Jobs\DeployApplication;
use App\Http\Controllers\Controller;
use App\Http\Resources\ApplicationResource;
use App\Http\Requests\ApplicationStoreRequest;
use App\Http\Requests\ApplicationUpdateRequest;
use App\Jobs\DeleteApplication;

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
     * Show an application
     *
     * @return void
     */
    public function show(Application $application)
    {
        return new ApplicationResource($application);
    }
    
    /**
     * Update an application
     *
     * @return void
     */
    public function update(Application $application, ApplicationUpdateRequest $request)
    {
        $application->update($request->all());
        $application->save();
        
        return new ApplicationResource($application);
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

        DeployApplication::dispatch($application->fresh(), json_decode(json_encode($request->all())));

        return new ApplicationResource($application);
    }

    /**
     * Deletes an application from the server
     *
     * @param Application $application
     * @return void
     */
    public function destroy(Application $application)
    {
        DeleteApplication::dispatch($application);
    }
}
