<?php

namespace src\app\models;

class categoryModel extends baseModel
{
    private static $table_name = 'category';
    protected $id;
    protected $accountid;
    protected $categoryid;
    protected $fullname;
    protected $description;
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
