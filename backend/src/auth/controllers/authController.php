<?php

namespace src\auth\controllers;

use src\app\models\accountModel;
use src\auth\classes\helpers;
use src\auth\models\refreshtokenModel;
use src\auth\models\accesstokenModel;
use src\auth\classes\JWT;
use src\auth\models\userModel;
use src\core\db;
use src\core\emailService;

class authController extends baseController
{
    public static function authenticateAccessToken(): array
    {
        if (!self::isBearerTokenValid($_SERVER["HTTP_AUTHORIZATION"], $token)) {
            return helpers::formatResponse(400, 'Incomplete Authorization Header', $_SERVER);
        }
        return JWT::decode(JWT::maskToken($token, 'decrypt'));
    }

    public static function forgot(array $request): array
    {
        if (!self::isValidAccountInfo($request)) {
            return helpers::formatResponse(400, 'Missing Account Info', []);
        }

        $result = self::getAllFilteredBase(new userModel(), ['email' => $request['email'], 'username' => $request['username']]);
        if ($result['status'] === 200) {
            $tmppwd = helpers::tmpPassword(12);
            self::sendTmpPwd($result['data']['email'], $tmppwd);
            $tmppwdhash = password_hash($tmppwd, PASSWORD_DEFAULT);
            return self::modifyBase(new userModel(), ['id' => $result['data']['id'], 'password' => $tmppwdhash]);
        }
        return helpers::formatResponse(400, 'Missing Account Info', []);
    }

    public static function login(array $request): array
    {
        if (!self::hasValidLoginCredentials($request)) {
            return helpers::formatResponse(400, 'Missing Login Credentials', [$request]);
        }

        $user = self::getOneByColumnBase(new userModel(), ['email' => $request['email']]);
        if ($user['status'] !== 200 || !password_verify($request['password'], $user['data']['password']) || $user['data']['status'] !== 'activo') {
            return helpers::formatResponse(401, 'Invalid Authentication', []);
        }

        return self::generateTokensForUser($user['data']);
    }

    public static function refresh(array $request): array
    {
        if (!array_key_exists('refresh_token', $request)) {
            return helpers::formatResponse(400, 'Missing Token', []);
        }

        $token = JWT::maskToken($request['refresh_token'], 'decrypt');
        if (self::getByToken($token)['status'] !== 200) {
            return helpers::formatResponse(400, 'Token not exist on whitelist', []);
        }

        $decodedToken = JWT::decode($token);
        if ($decodedToken['status'] !== 200) {
            return $decodedToken;
        }

        $user = self::getOneByIdBase(new userModel(), ['id' => $decodedToken['data']['sub']]);
        if ($user['status'] !== 200) {
            return helpers::formatResponse(401, 'Invalid Authentication', []);
        }

        return self::generateTokensForUser($user['data']);
    }

    public static function logout(array $request): array
    {
        if (!array_key_exists('token', $request)) {
            return helpers::formatResponse(400, 'Missing Token', []);
        }
        return self::deleteToken($request['token']);
    }

    private static function deleteExpiredTokens()
    {
        self::hardDeleteByColumnMinorBase(new refreshtokenModel(), ['expires_at' => time()]);
    }

    private static function getByToken(string $token): array
    {
        return self::getOneByColumnBase(new refreshtokenModel(), ['hash' => self::hashToken($token)]);
    }

    private static function deleteToken(string $token): array
    {
        return self::hardDeleteAllBase(new refreshtokenModel(), ['hash' => self::hashToken($token)]);
    }

    private static function sendTmpPwd(string $email, string $pwd): array
    {
        return emailService::sendTmpPwd($email, $pwd)
            ? helpers::formatResponse(200, 'Mail Sent', [])
            : helpers::formatResponse(401, 'Mail Not sent', []);
    }

    private static function isBearerTokenValid(string $authorizationHeader, &$token): bool
    {
        return preg_match("/^Bearer\s+(.*)$/", $authorizationHeader, $matches) ? $token = $matches[1] : false;
    }

    private static function isValidAccountInfo(array $request): bool
    {
        return array_key_exists('email', $request) || array_key_exists('username', $request);
    }

    private static function hasValidLoginCredentials(array $request): bool
    {
        return array_key_exists('email', $request) && array_key_exists('password', $request);
    }

    private static function generateTokensForUser(array $userData): array
    {
        $expires_at = time() + 86400;
        $expires_rt = time() + 432000;

        $access_token = JWT::encode(['id' => $userData['id'], 'lastlogin' => date("Y-m-d H:i:s"), 'expire' => $expires_at]);
        $hashAToken = self::hashToken($access_token);
        $at_payload = ['hash' => $hashAToken, 'expires_at' => $expires_at, '_USER' => ['id' => $userData['id']]];

        $refresh_token = JWT::encode(['sub' => $userData['id'], 'expire' => $expires_rt]);
        $hashRToken = self::hashToken($refresh_token);
        $rt_payload = ['hash' => $hashRToken, 'expires_at' => $expires_rt, '_USER' => ['id' => $userData['id']]];

        self::deleteExpiredTokens();
        self::modifyBase(new userModel(), $at_payload);
        self::storeBase(new refreshtokenModel(), $rt_payload);
        self::storeBase(new accesstokenModel(), $at_payload);

        unset($userData['password']);

        $response = array_merge($userData, [
            'access_token' => JWT::maskToken($access_token, 'encrypt'),
            'refresh_token' => JWT::maskToken($refresh_token, 'encrypt'),
            'expires_at' => $expires_at
        ]);

        return helpers::formatResponse(200, 'Successful Login Authentication', $response);
    }

    private static function hashToken(string $token): string
    {
        return hash_hmac("sha256", $token, db::get('jwtKey'));
    }
}


