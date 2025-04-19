<?php

namespace src\app\models;

class salehistoryModel extends baseModel
{
    private static $table_name = 'salehistory';
    protected $id;
    protected $saleid;
    protected $status;
    protected $description;
    protected $module;
    protected $action;
    protected $comments;
    protected $created_by;
    protected $created_at;
    protected $modified_by;
    protected $modified_at;

    public static function getTableName()
    {
        return self::$table_name;
    }
}
