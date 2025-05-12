<?php

namespace src\app\controllers;

use \src\app\models\supplierModel;

class supplierController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new supplierModel()); }
    public static function getAllPaginated(array $request): array { return self::getAllPaginatedBase(new supplierModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new supplierModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new supplierModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new supplierModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new supplierModel(), $request); }
    public static function store(array $request) { return self::storeBase(new supplierModel(), $request); }
    public static function update(array $request) { return self::updateBase(new supplierModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new supplierModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new supplierModel(), $request); }
} 