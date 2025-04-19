<?php

namespace src\app\controllers;

use \src\app\models\itemModel;

class itemController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new itemModel()); }
    public static function getAllPaginated(array $request): array { return self::getAllPaginatedBase(new itemModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new itemModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new itemModel(), $request); }
    public static function getOneByColumn(array $request): array { return self::getOneByColumnBase(new itemModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new itemModel(), $request); }
    public static function getAllDataByLike(array $request): array { return self::getAllDataByLikeBase(new itemModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new itemModel(), $request); }
    public static function store(array $request) { return self::storeBase(new itemModel(), $request); }
    public static function update(array $request) { return self::updateBase(new itemModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new itemModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new itemModel(), $request); }
}