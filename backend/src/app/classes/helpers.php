<?php

namespace src\app\classes;

class helpers
{
    public static array $modules = ['account', 'category', 'document', 'ente', 'item', 'property', 'user'];
    public static array $monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    public static function validModule($module): bool
    {
        return in_array($module, self::$modules);
    }
    public static function getMonthName(int $monthNumber): string
    {
        return self::$monthNames[$monthNumber - 1];
    }

    public static function dye($value): void
    {
        echo '<pre>';
        print_r($value);
        echo '</pre>';
        exit();
    }

    public static function formatResponse($status, $message, $data = []): array
    {
        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    public static function returnToAction(array $response): void
    {
        echo json_encode($response, http_response_code($response['status']));
    }

    public static function getFirstKeyName(array $array)
    {
        $keys = array_keys($array);
        return $keys[0];
    }

    public static function populateModel(object $model, array $data): object
    {
        foreach ($data as $key => $value)
            if (property_exists($model, $key))
                $model->set($key, $value);
        return $model;
    }

    public static function validateDate($date, $format = 'Y/m/d H:i:s')
    {
        $d = \DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) === $date;
    }

    public static function slugify($text, string $divider = '-')
    {
        $return = strval('');
        $parts = explode(' ', $text);
        $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

        if (count($parts) > 0) {
            foreach ($parts as $value) {
                $value = preg_replace('~[^-\w]+~', '', $value);
                $value = trim($value);
                $return .= strtolower(substr($value, 0, 10));
            }
        }

        return $return;
    }

    public static function is_hex($hex_code): bool
    {
        return @preg_match("/^[a-f0-9]{2,}$/i", $hex_code) && !(strlen($hex_code) & 1);
    }

    public static function tmpPassword(int $length): string
    {
        $pwd = strval('');
        $pattern = 'abchijnopxyz/[]!@#$%^&*()0~';
        $max = strlen($pattern) - 1;

        for ($i = 0; $i < $length; $i++)
            $pwd .= $pattern[mt_rand(0, $max)];

        return strtoupper($pwd);
    }

    public static function extractToken(): string
    {
        $exploded = explode(' ', $_SERVER["HTTP_AUTHORIZATION"]);
        return $exploded[1];
    }

    public static function cleanArray(array $input): array
    {
        $output = [];
        foreach ($input as $key => $value) {
            $cleanKey = trim($key);
            $cleanValue = urldecode(trim($value));
            $output[$cleanKey] = $cleanValue;
        }
        return $output;
    }


}