<?php

namespace src\app\models;

class prospectModel extends baseModel
{
    private static $table_name = 'prospect';
    public $id;
    public $name;
    public $email;
    public $phone;
    public $company;
    public $position;
    public $interest_level;
    public $source;
    public $notes;
    public $status;
    public $created_by;
    public $modified_by;
    public $created_at;
    public $updated_at;
    public $last_contact_date;
    public $assigned_to;
    public $potential_value;
    public $industry;
    public $address;
    public $city;
    public $state;
    public $country;
    public $postal_code;
    public $website;
    public $social_media;
    public $preferred_contact_method;
    public $tags;

    public static function getTableName()
    {
        return self::$table_name;
    }
} 