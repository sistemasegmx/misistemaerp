<?php

namespace src\app\models;

class currencyModel extends baseModel
{
    private static $table_name = 'currency';
    protected $id;
    protected $accountid;
    protected $fullname;
    protected $amount;
    protected $symbol;
    protected $currency_precision;
    protected $thousand_separator;
    protected $decimal_separator;
    protected $code;
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
