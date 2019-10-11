#!/bin/bash

@if($application->deployment_script)
    {!! $application->deployment_script !!}
@else
    @include('scripts.apps.static-html.static-html-deploy-default', [
        'application' => $application
    ])
@endif