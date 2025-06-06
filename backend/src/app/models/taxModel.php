<?php

namespace src\app\models;

class taxModel extends baseModel
{
    private static $table_name = 'tax';
    protected $id;
    protected $accountid;
    protected $fullname;
    protected $description;
    protected $amount;
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
