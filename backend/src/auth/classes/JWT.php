<?php

namespace src\auth\classes;

use src\core\db;

class JWT
{
    public static function encode(array $payload): string
    {
        $header = self::base64urlEncode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload = self::base64urlEncode(json_encode($payload));
        $signature = self::base64urlEncode(hash_hmac('sha256', $header . '.' . $payload, db::get('jwtKey'), true));

        return $header . '.' . $payload . '.' . $signature;
    }

    public static function decode(string $token): array
    {
        if (preg_match("/^(?<header>.+)\.(?<payload>.+)\.(?<signature>.+)$/", $token, $matches) !== 1)
            $return = helpers::formatResponse(401, "Invalid Token format", []);
        else if (!hash_equals(hash_hmac("sha256", $matches["header"] . "." . $matches["payload"], db::get('jwtKey'), true), self::base64urlDecode($matches["signature"])))
            $return = helpers::formatResponse(401, "Signature doesn\'t match", []);
        else if (json_decode(self::base64urlDecode($matches["payload"]), true)['expire'] < time())
            $return = helpers::formatResponse(401, "Token Expired", []);
        else
            $return = helpers::formatResponse(200, 'Successful Authorization', json_decode(self::base64urlDecode($matches["payload"]), true));

        return $return;
    }

    public static function maskToken(string $plaintext, string $action): string
    {
        return empty($plaintext)
            ? ''
            : match ($action) {
                'decrypt' => self::decrypt($plaintext, db::get('vectorKey'), db::get('vectorInit')),
                'encrypt' => self::encrypt($plaintext, db::get('vectorKey'), db::get('vectorInit')),
            };
    }

    private static function base64urlEncode(string $text): string
    {
        return str_replace(
            ["+", "/", "="],
            ["-", "_", ""],
            base64_encode($text)
        );
    }

    private static function base64urlDecode(string $text): string
    {
        return base64_decode(
            str_replace(
                ["-", "_"],
                ["+", "/"],
                $text
            )
        );
    }

    private static function encrypt($plaintext, $key, $iv)
    {
        $encrypted = openssl_encrypt($plaintext, 'aes-256-cbc', $key, 0, $iv);
        return base64_encode($encrypted);
    }

    private static function decrypt($plaintext, $key, $iv)
    {
        $encrypted = base64_decode($plaintext);

        return openssl_decrypt($encrypted, 'aes-256-cbc', $key, 0, $iv);
    }
}