<?php

namespace App\Http\Resources;

use App\CertDetails;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
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
            'type' => $this->type,
            'domain' => $this->domain,
            'directory' => $this->directory,
            'status' => $this->status,
            'deployment_script' => $this->deployment_script,
            'user_source_provider_id' => $this->user_source_provider_id,
            'deploy_form_git' => $this->deploy_form_git,
            'ssl_provider_id' => $this->ssl_provider_id,
            'respository' => $this->respository,
            'ssl_enabled' => $this->ssl_enabled,
            'git_branch' => $this->git_branch,
            'server_id' => $this->server_id,
            'user_id' => $this->user_id,
            'server' => $this->server,
            'certificate_details' => [
                'days_left' => (new CertDetails($this->domain))->getDaysLeft()
            ]
        ];
    }
}
