<?php

namespace src\app\models;

class salespersonModel extends baseModel
{
    private static $table_name = 'salesperson';
    public $id;
    public $first_name;
    public $last_name;
    public $email;
    public $phone;
    public $mobile;
    public $employee_id;
    public $territory;
    public $commission_rate;
    public $sales_target;
    public $status;
    public $created_at;
    public $updated_at;
    public $address;
    public $city;
    public $state;
    public $country;
    public $postal_code;
    public $specialization;
    public $total_sales;
    public $current_month_sales;
    public $last_sale_date;
    public $performance_rating;
    public $notes;
    public $supervisor_id;
    public $assigned_customers;
    public $assigned_prospects;
    public $sales_history;
    public $profile_photo;
    public $social_media;

    public static function getTableName()
    {
        return self::$table_name;
    }
} 