<?php

namespace src\app\controllers;

use \src\app\models\accountModel;

class accountController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new accountModel()); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new accountModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new accountModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new accountModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new accountModel(), $request); }
    public static function store(array $request) { return self::storeBase(new accountModel(), $request); }
    public static function update(array $request) { return self::updateBase(new accountModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new accountModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new accountModel(), $request); }
}