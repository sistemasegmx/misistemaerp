<?php

namespace src\app\controllers;

use \src\app\models\enteModel;

class enteController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new enteModel()); }
    public static function getAllPaginated(array $request): array { return self::getAllPaginatedBase(new enteModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new enteModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new enteModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new enteModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new enteModel(), $request); }
    public static function store(array $request) { return self::storeBase(new enteModel(), $request); }
    public static function update(array $request) { return self::updateBase(new enteModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new enteModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new enteModel(), $request); }
}
