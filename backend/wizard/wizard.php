<?php

namespace APIWizard;

class wizard
{
    private static $conn;

    public static function index($filename)
    {
        $return = helpers::formatResponse(201, 'Not registered ' . WDB_NAME . ' at: ' . WDB_HOST, []);

        self::$conn = self::connection();

        if (self::$conn) {

            $query = file_get_contents($filename);

            self::$conn->multi_query($query);

            self::$conn->close();

            $return =  helpers::formatResponse(200, 'Wizard complete ' . WDB_NAME . ' at: ' . WDB_HOST, []);
        }

        return $return;
    }

    private static function connection()
    {
        $conn = new \mysqli(WDB_HOST, WDB_USER, WDB_PASS, WDB_NAME);

        if (mysqli_connect_errno()) return false;

        return $conn;
    }
}
