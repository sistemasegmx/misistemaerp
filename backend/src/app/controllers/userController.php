<?php

namespace src\app\controllers;

use src\app\models\accountModel;
use src\app\models\userModel;
use src\app\classes\helpers;
use src\auth\classes\JWT;
use src\auth\models\accesstokenModel;
use src\core\db;

class userController extends baseController
{
    public static function getAll(): array
    {
        return self::getAllBase(new userModel());
    }

    public static function getAllFiltered(array $request): array
    {
        return self::getAllFilteredBase(new userModel(), $request);
    }

    public static function getOneById(array $request): array
    {
        return self::getOneByIdBase(new userModel(), $request);
    }

    public static function getAllDataByColumn(array $request): array
    {
        return self::getAllDataByColumnBase(new userModel(), $request);
    }

    public static function store(array $request): array
    {
        $sanitizedEmail = filter_var($request['email'] ?? '', FILTER_SANITIZE_EMAIL);

        if (empty($sanitizedEmail) || empty($request['password']) || empty($request['fullname'])) {
            return helpers::formatResponse(400, 'All fields must be valid', []);
        }

        if (self::isEmailTaken($sanitizedEmail)) {
            return helpers::formatResponse(400, 'Email already taken', []);
        }

        $account = self::getOneByIdBase(new accountModel(), ['id' => $request['accountid']]);
        $request['username'] = self::generateUniqueUsername($sanitizedEmail, $account['data']['slug']);
        $request['password'] = password_hash($request['password'], PASSWORD_DEFAULT);
        $request['email'] = $sanitizedEmail;

        return self::storeBase(new userModel(), $request);
    }

    public static function update(array $request): array
    {
        if (isset($request['password']) && !empty($request['password']))
            $request['password'] = password_hash($request['password'], PASSWORD_DEFAULT);
        else
            unset($request['password']);

        return self::updateBase(new userModel(), $request);
    }

    public static function modify(array $request): array
    {
        if (isset($request['password'])) {
            $request['password'] = password_hash($request['password'], PASSWORD_DEFAULT);
        }

        return self::modifyBase(new userModel(), $request);
    }

    public static function hardDelete(array $request): array
    {
        return self::hardDeleteByIdBase(new userModel(), $request);
    }

    public static function userByToken(): array
    {
        $token = JWT::maskToken(helpers::extractToken(), 'decrypt');
        if (empty($token)) {
            return helpers::formatResponse(400, 'Missing Token Info', []);
        }

        if (!self::isTokenValid($token)) {
            return helpers::formatResponse(400, 'Invalid token', []);
        }

        $decoded = JWT::decode($token);
        if ($decoded['status'] !== 200) {
            return helpers::formatResponse(400, 'Invalid token', []);
        }

        $userId = $decoded['data']['id'];
        $user = self::getOneByIdBase(new userModel(), ['id' => $userId])['data'];

        if (empty($user)) {
            return helpers::formatResponse(500, 'User not found', []);
        }

        $account = self::getOneByIdBase(new accountModel(), ['id' => $user['accountid']]);
        if ($account['status'] !== 200) {
            return helpers::formatResponse(500, 'Missing Account Info', []);
        }

        unset($user['password']);
        $response = array_merge($user, ['account' => $account['data']]);

        return helpers::formatResponse(200, 'Token on whitelist', $response);
    }


    private static function getByToken(string $token): array
    {
        $hashedToken = hash_hmac("sha256", $token, db::get('jwtKey'));
        return self::getOneByColumnBase(new accesstokenModel(), ['hash' => $hashedToken]);
    }

    private static function extractUsername(string $email): string
    {
        return explode('@', $email)[0];
    }

    private static function generateUniqueUsername(string $email, string $slug): string
    {
        $username = self::extractUsername($email);
        $counter = 0;
        do {
            $uniqueUsername = ($counter === 0) ? "{$username}.{$slug}" : "{$username}-{$counter}.{$slug}";
            $counter++;
        } while (self::isUsernameTaken($uniqueUsername));

        return $uniqueUsername;
    }

    private static function isEmailTaken(string $email): bool
    {
        return self::checkExistByColumnBase(new userModel(), ['email' => $email])['status'] === 200;
    }


    private static function isUsernameTaken(string $username): bool
    {
        return self::checkExistByColumnBase(new userModel(), ['username' => $username])['status'] === 200;
    }

    private static function isTokenValid(string $token): bool
    {
        return self::getByToken($token)['status'] === 200;
    }

    public static function getPreDataByLike(array $request): array
    {
        return self::getPreDataByLikeBase(new userModel(), $request);
    }

}
