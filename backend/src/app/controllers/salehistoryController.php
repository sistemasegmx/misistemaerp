<?php

namespace src\app\controllers;

use \src\app\models\salehistoryModel;

class salehistoryController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new salehistoryModel()); }
    public static function getCountFiltered(array $request): array { return self::getCountFilteredBase(new salehistoryModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new salehistoryModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new salehistoryModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new salehistoryModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new salehistoryModel(), $request); }
    public static function store(array $request) { return self::storeBase(new salehistoryModel(), $request); }
    public static function update(array $request) { return self::updateBase(new salehistoryModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new salehistoryModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new salehistoryModel(), $request); }
}
