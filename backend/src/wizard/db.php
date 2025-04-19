<?php

namespace src\wizard;

use Exception;

class db
{
	public static $_instance;
	private static $WDB_HOST = 'localhost';

	private static $WDB_USER = 'root';

	private static $WDB_PASS = 'toor';

	private static $WDB_NAME = 'misistemaerp_sistemasegmx';

	private static $WDB_PORT = '3306';

	public static function get($key)
	{
		return self::${$key};
	}

	public static function connect()
	{
		try {

			self::$_instance = new \mysqli(self::get('WDB_HOST'), self::get('WDB_USER'), self::get('WDB_PASS'), self::get('WDB_NAME'));

		} catch (Exception $e) {

			self::$_instance = 'Connection error: ' . mysqli_connect_errno();
		}

		return self::$_instance;
	}
}
