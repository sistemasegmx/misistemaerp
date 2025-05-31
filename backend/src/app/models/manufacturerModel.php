<?php

namespace src\app\models;

class manufacturerModel extends baseModel
{
    private static $table_name = 'manufacturer';
    public $id;
    public $name;
    public $email;
    public $phone;
    public $tax_id;
    public $manufacturer_type;
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
    public $facility_locations;
    public $primary_contact_id;
    public $preferred_payment_method;
    public $notes;
    public $tags;
    public $manufacturing_since;
    public $quality_rating;
    public $delivery_rating;
    public $price_rating;
    public $certifications;
    public $banking_info;
    public $production_capacity;
    public $specialization;
    public $equipment_capabilities;
    public $quality_control_processes;
    public $environmental_compliance;
    public $safety_records;
    public $product_categories;

    public static function getTableName()
    {
        return self::$table_name;
    }
} 