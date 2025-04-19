<?php

namespace src\app\models;

class refreshtokenModel extends baseModel
{
    private static $table_name = 'refresh_token';
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
