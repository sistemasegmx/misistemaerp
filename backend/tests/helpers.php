<?php

namespace APITest;

class helpers
{
    public static function getDomainName($endpoint)
    {
        return 'http://apisintegrationmvc' . $endpoint;
    }

    public static function formatResponse($status, $message, $data = [])
    {
        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    public static function getFileAsJSON($filename)
    {
        $return = strval('');
        if (filesize($filename) > 0) {
            $fd = fopen($filename, 'r');
            $return = fread($fd, filesize($filename));
            fclose($fd);
        }

        return $return;
    }

    public static function dye($value)
    {
        echo '<pre>';
        print_r($value);
        echo '</pre>';
        exit(1);
    }
}
