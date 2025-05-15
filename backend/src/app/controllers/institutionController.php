<?php

namespace src\app\controllers;

use \src\app\models\institutionModel;

class institutionController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new institutionModel()); }
    public static function getAllPaginated(array $request): array { return self::getAllPaginatedBase(new institutionModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new institutionModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new institutionModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new institutionModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new institutionModel(), $request); }
    public static function store(array $request) { return self::storeBase(new institutionModel(), $request); }
    public static function update(array $request) { return self::updateBase(new institutionModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new institutionModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new institutionModel(), $request); }
} 