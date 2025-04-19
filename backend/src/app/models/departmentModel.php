<?php

namespace src\app\models;

class departmentModel extends baseModel
{
    private static $table_name = 'department';
    protected $id;
    protected $accountid;
    protected $managerid;
    protected $managername;
    protected $fullname;
    protected $description;
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
