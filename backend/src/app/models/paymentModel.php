<?php

namespace src\app\models;

class paymentModel extends baseModel
{
    private static $table_name = 'payment';
    protected $id;
    protected $accountid;
    protected $saleid;
    protected $balancedue;
    protected $amount;
    protected $currency;
    protected $parity;
    protected $method;
    protected $reference;
    protected $startdate;
    protected $enddate;
    protected $pyear;
    protected $pmonth;
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
