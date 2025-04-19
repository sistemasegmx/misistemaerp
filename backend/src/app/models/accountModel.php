<?php

namespace src\app\models;

class accountModel extends baseModel
{
    private static $table_name = 'account';
    protected $id;
    protected $currencyid;
    protected $taxid;
    protected $nationality;
    protected $fullname;
    protected $rfc;
    protected $fiscalname;
    protected $fulladdress;
    protected $description;
    protected $email;
    protected $phone;
    protected $company_usa;
    protected $address_usa;
    protected $phone_usa;
    protected $defaultcomments;
    protected $slug;
    protected $image;
    protected $type;
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
