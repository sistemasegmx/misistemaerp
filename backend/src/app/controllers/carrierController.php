<?php

namespace src\app\controllers;

use \src\app\models\carrierModel;

class carrierController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new carrierModel()); }
    public static function getAllPaginated(array $request): array { return self::getAllPaginatedBase(new carrierModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new carrierModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new carrierModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new carrierModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new carrierModel(), $request); }
    public static function store(array $request) { return self::storeBase(new carrierModel(), $request); }
    public static function update(array $request) { return self::updateBase(new carrierModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new carrierModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new carrierModel(), $request); }
} 