<?php

namespace src\app\models;

class useraccountaccessModel extends baseModel
{
    private static $table_name = 'useraccountaccess';
    protected $id;
    protected $userid;
    protected $accountid;
    protected $created_by;
    protected $modified_by;

    public static function getTableName()
    {
        return self::$table_name;
    }
}
