<?php

namespace src\core;

class helpers
{
    public static function getDomainName($endpoint)
    {
        return 'http://misistemaerp_sistemasegmx' . $endpoint;
    }    

    public static function indexAction(): array
    {
        return self::formatResponse(200, 'Let\'s start build something Incredible!', []);
    }

    public static function noActionFound(): array
    {
        return self::formatResponse(404, 'No Action Found!', []);
    }

    public static function dye($value): void
    {
        echo '<pre>';
        print_r($value);
        echo '</pre>';
        exit(1);
    }

    public static function formatResponse($status, $message, $data = []): array
    {
        return [
            'status' => intval($status),
            'message' => $message,
            'data' => $data
        ];
    }

    public static function returnToAction(array $response): void
    {
        echo json_encode($response, http_response_code($response['status']));
    }

}