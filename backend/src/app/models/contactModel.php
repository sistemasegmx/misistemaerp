<?php

namespace src\app\models;

class contactModel extends baseModel
{
    public $id;
    public $first_name;
    public $last_name;
    public $email;
    public $phone;
    public $mobile;
    public $position;
    public $department;
    public $related_entity_id;
    public $related_entity_type;
    public $is_primary_contact;
    public $status;
    public $created_at;
    public $updated_at;
    public $address;
    public $city;
    public $state;
    public $country;
    public $postal_code;
    public $notes;
    public $preferred_contact_method;
    public $birth_date;
    public $anniversary_date;
    public $social_media;
    public $tags;
    public $assigned_to;
} 