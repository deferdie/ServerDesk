<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use App\Filters\Filter;

trait Filterable
{
    /**
     * Applies a filter to the query builder
     *
     * @param Illuminate\Database\Eloquent\Builder $query
     * @param Filter $filter
     * 
     * @return void
     */
    public function scopeFilterResult(Builder $query, Filter $filter)
    {
        return $filter->apply($query);
    }
}
