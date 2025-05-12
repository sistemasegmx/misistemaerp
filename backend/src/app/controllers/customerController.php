<?php

namespace src\app\controllers;

use \src\app\models\customerModel;

class customerController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new customerModel()); }
    public static function getAllPaginated(array $request): array { return self::getAllPaginatedBase(new customerModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new customerModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new customerModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new customerModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new customerModel(), $request); }
    public static function store(array $request) { return self::storeBase(new customerModel(), $request); }
    public static function update(array $request) { return self::updateBase(new customerModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new customerModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new customerModel(), $request); }
} 