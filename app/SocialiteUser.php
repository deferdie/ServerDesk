<?php

namespace App;

class SocialiteUser
{
    /**
     * The email for the usre
     *
     * @var string
     */
    protected $email;

    /**
     * The ID for the user
     *
     * @var string
     */
    protected $id;

    /**
     * The name for the user
     *
     * @var String
     */
    protected $name;

    public function __construct(array $payload)
    {
        $this->email = $payload['email'];
        $this->id = $payload['id'];
        $this->name = $payload['name'];
    }

    /**
     * Get the eamil
     *
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * Returns the ID
     *
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * Returns the name for the User
     *
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }
}
