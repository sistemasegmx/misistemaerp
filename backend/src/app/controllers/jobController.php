<?php

namespace src\app\controllers;

use \src\app\models\jobModel;

class jobController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new jobModel()); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new jobModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new jobModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new jobModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new jobModel(), $request); }
    public static function store(array $request) { return self::storeBase(new jobModel(), $request); }
    public static function update(array $request) { return self::updateBase(new jobModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new jobModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new jobModel(), $request); }
}