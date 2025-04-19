<?php

namespace src\app\controllers;

use \src\app\models\categoryModel;

class categoryController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new categoryModel()); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new categoryModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new categoryModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new categoryModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new categoryModel(), $request); }
    public static function store(array $request) { return self::storeBase(new categoryModel(), $request); }
    public static function update(array $request) { return self::updateBase(new categoryModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new categoryModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new categoryModel(), $request); }
}