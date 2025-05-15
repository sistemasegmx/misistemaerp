<?php

namespace src\app\controllers;

use \src\app\models\prospectModel;

class prospectController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new prospectModel()); }
    public static function getAllPaginated(array $request): array { return self::getAllPaginatedBase(new prospectModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new prospectModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new prospectModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new prospectModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new prospectModel(), $request); }
    public static function store(array $request) { return self::storeBase(new prospectModel(), $request); }
    public static function update(array $request) { return self::updateBase(new prospectModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new prospectModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new prospectModel(), $request); }
} 