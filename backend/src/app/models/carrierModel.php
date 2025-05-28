<?php

namespace src\app\models;

class carrierModel extends baseModel
{
    private static $table_name = 'carrier';
    public $id;
    public $name;
    public $email;
    public $phone;
    public $tax_id;
    public $carrier_type;
    public $service_areas;
    public $payment_terms;
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
    public $fleet_size;
    public $fleet_type;
    public $primary_contact_id;
    public $preferred_payment_method;
    public $notes;
    public $tags;
    public $service_since;
    public $delivery_rating;
    public $price_rating;
    public $certifications;
    public $banking_info;
    public $insurance_info;
    public $tracking_system;
    public $service_coverage;
    public $special_handling_capabilities;
    public $operating_hours;

    public static function getTableName()
    {
        return self::$table_name;
    }
} 