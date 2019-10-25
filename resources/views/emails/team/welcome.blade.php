@component('mail::message')
# Welcme to ServerDesk

An administrator has added you to their team.

Your username for the login is: {{$user->email}}

@component('mail::button', ['url' => env('APP_URL') . '/password/reset/' . $token ])
Activate your account
@endcomponent

{{env('APP_URL') . '/password/reset/' . $token}}

Thanks,<br>
{{ config('app.name') }}
@endcomponent
