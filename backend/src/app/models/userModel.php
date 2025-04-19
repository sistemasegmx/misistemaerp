<?php

namespace src\app\models;

class userModel extends baseModel
{
    private static $table_name = 'user';
    protected $id;
    protected $accountid;
    protected $employeeid;
    protected $email;
    protected $username;
    protected $password;
    protected $fullname;
    protected $phone;
    protected $description;
    protected $lastlogin;
    protected $type;
    protected $image;
    protected $status;
    protected $created_by;
    protected $modified_by;

    public static function getTableName()
    {
        return self::$table_name;
    }
}
