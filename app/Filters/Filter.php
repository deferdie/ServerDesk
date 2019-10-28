<?php

namespace App\Filters;

use Illuminate\Http\Request;

abstract class Filter
{
    /**
     * Prefix to the filter for obtaining the full request
     * 
     * @var string
     */
    public const REQUEST_PREFIX = ':request:';

    /**
     * The request object
     *
     * @var Illuminate\Http\Request
     */
    protected $request;
    
    /**
     * The Eloquent model
     *
     * @var Illuminate\Database\Eloquent\Builder
     */
    protected $builder;

    /**
     * Associative array of filters available, mapping the filter name to the filter method
     *
     * @var array
     */
    protected $filterable = [];

    /**
     * Methods that the filter will not be applied on
     *
     * @var array
     */
    protected $dontFilterOnAction = [
        'show',
        'delete',
        'update',
        'store'
    ];

    /**
     * Bootstrap the Filters
     *
     * @param Illuminate\Http\Request $request
     */
    public function __construct(Request $request)
    {
        $this->request = $request;

        // Add ids to the filterables list if it hasn't already been added manually
        // This is so that id filtering can be overridden if required
        if (! array_key_exists('ids', $this->filterable)) {
            $this->filterable['ids'] = 'defaultFilterByIds';
        }
    }

    /**
     * Apply each filter to the builder
     *
     * @param Illuminate\Database\Eloquent\Builder $builder
     * 
     * @return Illuminate\Database\Eloquent\
     */
    public function apply($builder)
    {
        $this->builder = $builder;

        // Get the action being performed by this request
        if ($this->request->route()) {
            $action = explode('@', $this->request->route()->action['controller'])[1];
        } else {
            return $this->builder;
        }

        // Don't filter the response for certain actions
        if (in_array($action, $this->dontFilterOnAction)) {
            return $this->builder;
        }

        // Check the request for valid filters and apply each filter
        $appliedFilters = [];
        foreach ($this->filterable as $filterField => $filterMethod) {
            if (method_exists($this, $filterMethod)) {
                if ($this->request->exists($filterMethod)) {
                    $this->$filterMethod($this->request->$filterField);
                    $appliedFilters[$filterField] = $this->request->$filterField;
                } else if (substr($filterField, 0, strlen(self::REQUEST_PREFIX)) == self::REQUEST_PREFIX) {
                    // This filter requires the full request object
                    $this->$filterMethod($this->request);
                    $appliedFilters[substr($filterField, strlen(self::REQUEST_PREFIX))] = $this->request;
                }
            }
        }

        return $this->builder;
    }

    /**
     * Filter models by a list of ids
     * 
     * @param array $ids
     * 
     * @return Illuminate\Database\Eloquent\Builder
     */
    public function defaultFilterByIds($ids)
    {
        return $this->builder->whereIn('id', $ids);
    }
}
