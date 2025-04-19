<?php

namespace src\app\controllers;

use \src\app\models\currencyModel;

class currencyController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new currencyModel()); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new currencyModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new currencyModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new currencyModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new currencyModel(), $request); }
    public static function store(array $request) { return self::storeBase(new currencyModel(), $request); }
    public static function update(array $request) { return self::updateBase(new currencyModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new currencyModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new currencyModel(), $request); }
}