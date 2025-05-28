<?php

namespace src\app\models;

class supplierModel extends baseModel
{
    private static $table_name = 'supplier';
    public $id;
    public $name;
    public $email;
    public $phone;
    public $tax_id;
    public $supplier_type;
    public $payment_terms;
    public $credit_limit;
    public $status;
    public $created_by;
    public $modified_by;
    public $created_at;
    public $updated_at;
    public $last_order_date;
    public $address;
    public $city;
    public $state;
    public $country;
    public $postal_code;
    public $website;
    public $industry;
    public $primary_contact_id;
    public $preferred_payment_method;
    public $notes;
    public $tags;
    public $supplier_since;
    public $quality_rating;
    public $delivery_rating;
    public $price_rating;
    public $certifications;
    public $banking_info;

    public static function getTableName()
    {
        return self::$table_name;
    }
} 