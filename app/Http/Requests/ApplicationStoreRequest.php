<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class ApplicationStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules = [
            'type' => ['required', Rule::in([
                'PHP',
                'Laravel',
                'WordPress',
                'Adonis JS',
                'Static HTML',
            ])],
            'domain' => 'required',
            'server_id' => 'required|alpha_num',
        ];

        if (request()->has('type') && request()->type != 'WordPress') {
            array_push($rules, [
                'respository' => 'required',
                'directory' => 'string|nullable',
                'user_source_provider_id' => 'required|alpha_num'
            ]);
        }
        
        if (request()->has('type') && request()->type === 'WordPress') {
            $rules['mysql_database_id'] = 'required';
        }

        return $rules;
    }
}
