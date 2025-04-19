<?php

namespace src\app\controllers;

use \src\app\models\useraccountaccessModel;

class useraccountaccessController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new useraccountaccessModel()); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new useraccountaccessModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new useraccountaccessModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new useraccountaccessModel(), $request); }
    public static function store(array $request) { return self::storeBase(new useraccountaccessModel(), $request); }
    public static function update(array $request) { return self::updateBase(new useraccountaccessModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new useraccountaccessModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new useraccountaccessModel(), $request); }
}