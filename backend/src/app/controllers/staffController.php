<?php

namespace src\app\controllers;

use \src\app\models\staffModel;

class staffController extends baseController
{
    public static function getAll(): array  { return self::getAllBase(new staffModel()); }
    public static function getAllPaginated(array $request): array { return self::getAllPaginatedBase(new staffModel(), $request); }
    public static function getAllFiltered(array $request): array  { return self::getAllFilteredBase(new staffModel(), $request); }
    public static function getOneById(array $request): array  { return self::getOneByIdBase(new staffModel(), $request); }
    public static function getAllDataByColumn(array $request): array  { return self::getAllDataByColumnBase(new staffModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new staffModel(), $request); }
    public static function store(array $request)  { return self::storeBase(new staffModel(), $request); }
    public static function update(array $request)  { return self::updateBase(new staffModel(), $request); }
    public static function modify(array $request)  { return self::modifyBase(new staffModel(), $request); }
    public static function hardDelete(array $request)  { return self::hardDeleteByIdBase(new staffModel(), $request); }
}
