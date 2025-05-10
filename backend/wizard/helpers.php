<?php

namespace APIWizard;

class helpers
{

    public static function formatResponse($status, $message, $data = [])
    {
        return [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
    }

    public static function returnToAction(array $response)
    {
        echo json_encode($response, http_response_code($response['status']));
    }

    public static function dye($value)
    {
        echo '<pre>';
        print_r($value);
        echo '</pre>';
        exit(1);
    }
}
