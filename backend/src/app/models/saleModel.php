<?php

namespace src\app\models;

class saleModel extends baseModel
{
    private static $table_name = 'sale';
    protected $id;
    protected $accountid;
    protected $folio;
    protected $trackingnumber;
    protected $saleid;
    protected $enteid;
    protected $enteorder;
    protected $entecode;
    protected $entename;
    protected $entecontact;
    protected $currency;
    protected $parity;
    protected $taxname;
    protected $taxamount;
    protected $pricelevel;
    protected $subtotal;
    protected $total;
    protected $cost;
    protected $paid;
    protected $paymentmethod;
    protected $salename;
    protected $validity;
    protected $type;
    protected $countrycode;
    protected $items;
    protected $startdate;
    protected $enddate;
    protected $defaultcomment;
    protected $description;
    protected $status;
    protected $created_by;
    protected $created_at;
    protected $modified_by;
    protected $modified_at;

    public static function getTableName()
    {
        return self::$table_name;
    }
}
