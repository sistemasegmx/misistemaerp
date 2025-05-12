<?php

namespace src\app\models;

class providerModel extends baseModel
{
    private static $table_name = 'provider';
    protected $id;
    protected $accountid;
    protected $code;
    protected $fullname;
    protected $nationality;
    protected $rfc;
    protected $fiscalname;
    protected $fulladdress;
    protected $email;
    protected $phone;
    protected $level;
    protected $type;
    protected $image;
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
