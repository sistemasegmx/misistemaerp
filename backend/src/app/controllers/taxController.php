<?php

namespace src\app\controllers;

use \src\app\models\taxModel;

class taxController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new taxModel()); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new taxModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new taxModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new taxModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new taxModel(), $request); }
    public static function store(array $request) { return self::storeBase(new taxModel(), $request); }
    public static function update(array $request) { return self::updateBase(new taxModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new taxModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new taxModel(), $request); }
}