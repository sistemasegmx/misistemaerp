<?php

namespace src\app\models;

class entecontactsModel extends baseModel
{
    private static $table_name = 'entecontacts';
    protected $id;
    protected $enteid;
    protected $fullname;
    protected $position;
    protected $email;
    protected $phone;
    protected $created_by;
    protected $created_at;
    protected $modified_by;
    protected $modified_at;

    public static function getTableName()
    {
        return self::$table_name;
    }
}
