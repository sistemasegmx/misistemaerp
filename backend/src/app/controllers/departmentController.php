<?php

namespace src\app\controllers;

use \src\app\models\departmentModel;

class departmentController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new departmentModel()); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new departmentModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new departmentModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new departmentModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new departmentModel(), $request); }
    public static function store(array $request) { return self::storeBase(new departmentModel(), $request); }
    public static function update(array $request) { return self::updateBase(new departmentModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new departmentModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new departmentModel(), $request); }
}