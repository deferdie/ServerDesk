<?php

namespace App\Filters;

class ServerServiceFilter extends Filter
{
    /**
     * Filters the results based on the params passed in to the request
     *
     * @var array $filterable
     */
    protected $filterable = [
        'available'
    ];

    /**
     * Returns all of the services that can be installed 
     *
     * @return void
     */
    public function available($query)
    {

    }
}