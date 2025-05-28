<?php

namespace src\app\models;

class distributorModel extends baseModel
{
    private static $table_name = 'distributor';
    public $id;
    public $name;
    public $email;
    public $phone;
    public $tax_id;
    public $distribution_area;
    public $distribution_type;
    public $payment_terms;
    public $credit_limit;
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
    public $warehouse_locations;
    public $primary_contact_id;
    public $preferred_payment_method;
    public $notes;
    public $tags;
    public $distribution_since;
    public $service_rating;
    public $delivery_rating;
    public $price_rating;
    public $certifications;
    public $banking_info;
    public $inventory_capacity;
    public $transportation_fleet;
    public $service_coverage;

    public static function getTableName()
    {
        return self::$table_name;
    }
} 