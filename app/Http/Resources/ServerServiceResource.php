<?php

namespace App\Http\Resources;

use App\Service;
use App\ServerService;
use Illuminate\Http\Resources\Json\JsonResource;

class ServerServiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'service' => $this->service,
            'server_id' => $this->server_id,
            'created_at' => $this->created_at,
        ];
    }
}
