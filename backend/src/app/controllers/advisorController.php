<?php

namespace src\app\controllers;

use \src\app\models\advisorModel;

class advisorController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new advisorModel()); }
    public static function getAllPaginated(array $request): array { return self::getAllPaginatedBase(new advisorModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new advisorModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new advisorModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new advisorModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new advisorModel(), $request); }
    public static function store(array $request) { return self::storeBase(new advisorModel(), $request); }
    public static function update(array $request) { return self::updateBase(new advisorModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new advisorModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new advisorModel(), $request); }
} 