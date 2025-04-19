<?php

namespace src\app\controllers;

use \src\app\models\entecontactsModel;

class entecontactsController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new entecontactsModel()); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new entecontactsModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new entecontactsModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new entecontactsModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new entecontactsModel(), $request); }
    public static function store(array $request) { return self::storeBase(new entecontactsModel(), $request); }
    public static function update(array $request) { return self::updateBase(new entecontactsModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new entecontactsModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new entecontactsModel(), $request); }
}
