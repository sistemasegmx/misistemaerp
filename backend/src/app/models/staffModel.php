<?php

namespace src\app\models;

class staffModel extends baseModel
{
    private static $table_name = 'staff';
    protected $id;
    protected $accountid;
    protected $managerid;
    protected $departmentid;
    protected $jobid;
    protected $code;
    protected $managername;
    protected $departmentname;
    protected $jobname;
    protected $fullname;
    protected $dob;
    protected $email;
    protected $phone;
    protected $fulladdress;
    protected $hire_date;
    protected $salary;
    protected $have_user;
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
