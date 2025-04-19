<?php

namespace src\wizard;

use src\core\helpers;
use src\wizard\db;

class wizardController
{
    private static $conn;

    private static $filename = __DIR__ . '/misistemaerp_sistemasegmx.sql';

    public static function index()
    {

        self::$conn = db::connect();

        $return = helpers::formatResponse(201, 'Not registered ' . db::get('WDB_NAME') . ' at: ' . db::get('WDB_HOST'), []);

        if (is_object(self::$conn)) {

            $query = file_get_contents(self::$filename);

            self::$conn->multi_query($query);

            self::$conn->close();

            $return = helpers::formatResponse(200, 'Wizard complete!, DB: ' . db::get('WDB_NAME') . ', Host: ' . db::get('WDB_HOST'), []);
        }

        return $return;
    }
}
