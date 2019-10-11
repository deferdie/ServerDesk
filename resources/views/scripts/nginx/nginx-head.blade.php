@if($application->ssl_enabled && $application->ssl_provider_id != null)
ssl on;
listen 443 ssl http2 default_server;
listen [::]:443 ssl http2 default_server;
@endif