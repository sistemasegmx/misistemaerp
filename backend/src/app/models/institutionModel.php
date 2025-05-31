<?php

namespace src\app\models;

class institutionModel extends baseModel
{
    private static $table_name = 'institution';
    public $id;
    public $name;
    public $email;
    public $phone;
    public $tax_id;
    public $institution_type;
    public $registration_number;
    public $status;
    public $created_by;
    public $modified_by;
    public $created_at;
    public $updated_at;
    public $address;
    public $city;
    public $state;
    public $country;
    public $postal_code;
    public $website;
    public $primary_contact_id;
    public $notes;
    public $tags;
    public $institution_since;
    public $accreditation;
    public $licenses;
    public $regulatory_compliance;
    public $operating_hours;
    public $services_offered;
    public $facilities;
    public $membership_programs;
    public $partnership_agreements;
    public $social_media;
    public $publications;
    public $events;
    public $funding_sources;
    public $governing_body;
    public $mission_statement;
    public $annual_reports;

    public static function getTableName()
    {
        return self::$table_name;
    }
}