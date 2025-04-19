<?php

namespace src\app\models;

class jobModel extends baseModel
{
    private static $table_name = 'job';
    protected $id;
    protected $accountid;
    protected $fullname;
    protected $description;
    protected $minsalary;
    protected $maxsalary;
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
