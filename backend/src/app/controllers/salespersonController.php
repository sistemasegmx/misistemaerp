<?php

namespace src\app\controllers;

use \src\app\models\salespersonModel;

class salespersonController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new salespersonModel()); }
    public static function getAllPaginated(array $request): array { return self::getAllPaginatedBase(new salespersonModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new salespersonModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new salespersonModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new salespersonModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new salespersonModel(), $request); }
    public static function store(array $request) { return self::storeBase(new salespersonModel(), $request); }
    public static function update(array $request) { return self::updateBase(new salespersonModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new salespersonModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new salespersonModel(), $request); }
} 