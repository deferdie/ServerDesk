<?php

namespace App\Http\Resources;

use App\Service;
use App\ServerService;
use Illuminate\Http\Resources\Json\JsonResource;

class ServerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request) + [
            'avaliable_service_installs' => $this->avaliableServicesToInstal()
        ];
    }

    /**
     * Gets the list of avaliable services to install
     *
     * @return void
     */
    public function avaliableServicesToInstal()
    {
        $services = Service::all();
        $avaliableServices = [];

        // Check if the server has any of the services installed
        foreach ($services as $service) {
            $where = [
                'server_id' => $this->id,
                'service_id' => $service->id,
            ];

            if (! ServerService::where($where)->exists()) {
                array_push($avaliableServices, $service);
            }
        }

        return $avaliableServices;
    }
}
