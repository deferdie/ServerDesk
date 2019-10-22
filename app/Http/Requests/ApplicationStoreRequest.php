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
        return [
            'type' => ['required', Rule::in([
                'PHP',
                'Laravel',
                'Adonis JS',
                'Static HTML',
            ])],
            'domain' => 'required',
            'respository' => 'required',
            'directory' => 'string|nullable',
            'server_id' => 'required|alpha_num',
            'user_source_provider_id' => 'required|alpha_num',
        ];
    }
}
