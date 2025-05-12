<?php

namespace src\app\controllers;

use \src\app\models\partnerModel;

class partnerController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new partnerModel()); }
    public static function getAllPaginated(array $request): array { return self::getAllPaginatedBase(new partnerModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new partnerModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new partnerModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new partnerModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new partnerModel(), $request); }
    public static function store(array $request) { return self::storeBase(new partnerModel(), $request); }
    public static function update(array $request) { return self::updateBase(new partnerModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new partnerModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new partnerModel(), $request); }
} 