<?php

namespace src\auth\models;

class accesstokenModel extends baseModel
{
    private static $table_name = 'access_token';
    protected $id;
    protected $hash;
    protected $expires_at;
    protected $created_by;
    protected $created_at;
    protected $modified_by;
    protected $modified_at;

    public static function getTableName()
    {
        return self::$table_name;
    }
}
