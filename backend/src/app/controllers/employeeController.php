<?php

namespace src\app\controllers;

use \src\app\models\employeeModel;

class employeeController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new employeeModel()); }
    public static function getAllPaginated(array $request): array { return self::getAllPaginatedBase(new employeeModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new employeeModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new employeeModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new employeeModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new employeeModel(), $request); }
    public static function store(array $request) { return self::storeBase(new employeeModel(), $request); }
    public static function update(array $request) { return self::updateBase(new employeeModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new employeeModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new employeeModel(), $request); }
} 