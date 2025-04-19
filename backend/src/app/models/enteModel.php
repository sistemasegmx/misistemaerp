<?php

namespace src\app\models;

class enteModel extends baseModel
{
    private static $table_name = 'ente';
    protected $id;
    protected $accountid;
    protected $staffid;
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
