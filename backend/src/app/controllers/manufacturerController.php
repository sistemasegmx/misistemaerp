<?php

namespace src\app\controllers;

use \src\app\models\manufacturerModel;

class manufacturerController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new manufacturerModel()); }
    public static function getAllPaginated(array $request): array { return self::getAllPaginatedBase(new manufacturerModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new manufacturerModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new manufacturerModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new manufacturerModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new manufacturerModel(), $request); }
    public static function store(array $request) { return self::storeBase(new manufacturerModel(), $request); }
    public static function update(array $request) { return self::updateBase(new manufacturerModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new manufacturerModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new manufacturerModel(), $request); }
} 