<?php

namespace src\app\models;

class salesequencesModel extends baseModel
{
    private static $table_name = 'salesequences';
    protected $id;
    protected $accountid;
    protected $type;
    protected $nextnumber;
    protected $created_by;
    protected $created_at;
    protected $modified_by;
    protected $modified_at;

    public static function getTableName()
    {
        return self::$table_name;
    }
}
