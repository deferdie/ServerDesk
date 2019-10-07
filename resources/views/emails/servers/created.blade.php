@component('mail::message')
# Your new server has been created

This email contains all of your your server credentials so please destroy this email when you have securly stored these credentials

@component('mail::table')

| Details       | Value          | Description  |
| :------------- |:--------------| --------:|
| Server name | {{$server->name}} |  |
| IP Address | {{$server->ip_address}} |  |
| Root password | {{$data['rootPassword']}} | The root password the server |
@isset($data['dbRootPass'])
| Database User | serverdesk | The default user for the database |
| Database host | 127.0.0.1 | The default host for the database |
| Database port | 3306 | The default port for the database |
| Database Password | {{$data['dbRootPass']}} | The root password for MySQL |
@endisset

@endcomponent

@component('mail::button', ['url' => ''])
View Server
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
