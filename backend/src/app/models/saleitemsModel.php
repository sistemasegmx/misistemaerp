<?php

namespace src\app\models;

class saleitemsModel extends baseModel
{
    private static $table_name = 'saleitems';
    protected $id;
    protected $saleid;
    protected $itemid;
    protected $code;
    protected $description;
    protected $unitkey;
    protected $qty;
    protected $price;
    protected $priceold;
    protected $cost;
    protected $delivered1;
    protected $delivered2;
    protected $delivered3;
    protected $estimated;
    protected $saletype;
    protected $originsale;
    protected $originfolio;
    protected $created_by;
    protected $created_at;
    protected $modified_by;
    protected $modified_at;

    public static function getTableName()
    {
        return self::$table_name;
    }
}