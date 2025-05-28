<?php

namespace src\app\models;

class customerModel extends baseModel
{
    private static $table_name = 'customer';
    public $id;
    public $name;
    public $email;
    public $phone;
    public $company;
    public $tax_id;
    public $customer_type;
    public $credit_limit;
    public $payment_terms;
    public $status;
    public $created_at;
    public $updated_at;
    public $last_purchase_date;
    public $total_purchases;
    public $address;
    public $city;
    public $state;
    public $country;
    public $postal_code;
    public $website;
    public $industry;
    public $assigned_salesperson;
    public $preferred_payment_method;
    public $notes;
    public $tags;
    public $customer_since;
    public $loyalty_points;
    public $preferred_shipping_method;

    public static function getTableName()
    {
        return self::$table_name;
    }
} 