<?php

namespace src\app\models;

class itemModel extends baseModel
{
    private static $table_name = 'item';
    protected $id;
    protected $accountid;
    protected $categoryid;
    protected $supplierid;
    protected $categoryname;
    protected $suppliername;
    protected $code;
    protected $code_alternative;
    protected $description;
    protected $unitkey;
    protected $cost;
    protected $price;
    protected $currencycost;
    protected $currencyprice;
    protected $image;
    protected $type;
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
