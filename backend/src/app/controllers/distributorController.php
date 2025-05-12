<?php

namespace src\app\controllers;

use \src\app\models\distributorModel;

class distributorController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new distributorModel()); }
    public static function getAllPaginated(array $request): array { return self::getAllPaginatedBase(new distributorModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new distributorModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new distributorModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new distributorModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new distributorModel(), $request); }
    public static function store(array $request) { return self::storeBase(new distributorModel(), $request); }
    public static function update(array $request) { return self::updateBase(new distributorModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new distributorModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new distributorModel(), $request); }
} 