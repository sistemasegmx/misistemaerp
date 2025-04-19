<?php

namespace src\core;

use PDO;

class db
{
    public static $_instance;
    private static $DB_HOST = 'localhost';
    private static $DB_NAME = 'misistemaerp_sistemasegmx';
    private static $DB_USER = 'root';
    private static $DB_PASS = 'toor';
    private static $DB_PORT = '3306';
    private static $DB_DSN;
    private static $jwtKey = '6E6D4C6A41412F53705357302D36502B6F7168736C4B423D5A624D57556C6954';
    private static $vectorKey = 'a1b2c3d4e5f607182930a1b2c3d4e5f6';
    private static $vectorInit = 'a7b8c9d0e1f2g3h4';


    private static $DB_OPTIONS = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
    ];

    private static function getDSN()
    {
        return 'mysql:host=' . self::get('DB_HOST') . '; port=' . self::get('DB_PORT') . '; dbname=' . self::get('DB_NAME');
    }

    public static function get($key)
    {
        return self::${$key};
    }

    public static function connect()
    {
        try {

            self::$_instance = new PDO(self::getDSN(), self::get('DB_USER'), self::get('DB_PASS'), self::get('DB_OPTIONS'));

        } catch (\PDOException $exception) {

            self::$_instance = 'Connection error: ' . $exception->getMessage();
        }

        return self::$_instance;
    }
}