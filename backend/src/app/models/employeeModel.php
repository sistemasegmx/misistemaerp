<?php

namespace src\app\models;

class employeeModel extends baseModel
{
    private static $table_name = 'employee';
    public $id;
    public $first_name;
    public $last_name;
    public $email;
    public $phone;
    public $mobile;
    public $employee_id;
    public $department_id;
    public $position;
    public $hire_date;
    public $termination_date;
    public $status;
    public $created_at;
    public $updated_at;
    public $address;
    public $city;
    public $state;
    public $country;
    public $postal_code;
    public $emergency_contact;
    public $birth_date;
    public $tax_id;
    public $banking_info;
    public $salary;
    public $benefits;
    public $skills;
    public $certifications;
    public $education;
    public $notes;
    public $supervisor_id;
    public $work_schedule;
    public $access_level;
    public $profile_photo;

    public static function getTableName()
    {
        return self::$table_name;
    }
} 