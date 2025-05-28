<?php

namespace src\app\models;

class affiliateModel extends baseModel
{
    private static $table_name = 'affiliate';
    public $id;
    public $name;
    public $email;
    public $phone;
    public $tax_id;
    public $affiliate_type;
    public $commission_rate;
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
    public $promotion_channels;
    public $primary_contact_id;
    public $preferred_payment_method;
    public $notes;
    public $tags;
    public $affiliate_since;
    public $total_referrals;
    public $total_earnings;
    public $current_month_earnings;
    public $banking_info;
    public $promotion_materials;
    public $tracking_code;
    public $performance_metrics;
    public $social_media;
    public $promotion_areas;
    public $target_audience;

    public static function getTableName()
    {
        return self::$table_name;
    }
} 