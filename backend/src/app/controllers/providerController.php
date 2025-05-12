<?php

namespace src\app\controllers;

use \src\app\models\providerModel;

class providerController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new providerModel()); }
    public static function getAllPaginated(array $request): array { return self::getAllPaginatedBase(new providerModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new providerModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new providerModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new providerModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new providerModel(), $request); }
    public static function store(array $request) { return self::storeBase(new providerModel(), $request); }
    public static function update(array $request) { return self::updateBase(new providerModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new providerModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new providerModel(), $request); }
}
