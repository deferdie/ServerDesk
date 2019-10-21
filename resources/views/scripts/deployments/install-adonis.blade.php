cd /var/www/html/serverdesk/{{$application->domain}}

npm i -g @adonisjs/cli

@if($application->deployment_script)
    {!! $application->deployment_script !!}
@else
    @include('scripts.apps.adonis.adonis-deploy-default', [
        'application' => $application
    ])
@endif

## Check if the user has set any predefined .env variables when creating the application
@isset($request)
    @isset($request->env_variables)
        @if(! is_null($request->env_variables) && $request->env_variables != '')
            echo '{{$request->env_variables}}' > .env
        @endif
    @else
    cp .env.example .env
    @endisset
@endisset