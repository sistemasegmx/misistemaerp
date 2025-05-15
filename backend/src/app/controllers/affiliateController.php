<?php

namespace src\app\controllers;

use \src\app\models\affiliateModel;

class affiliateController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new affiliateModel()); }
    public static function getAllPaginated(array $request): array { return self::getAllPaginatedBase(new affiliateModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new affiliateModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new affiliateModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new affiliateModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new affiliateModel(), $request); }
    public static function store(array $request) { return self::storeBase(new affiliateModel(), $request); }
    public static function update(array $request) { return self::updateBase(new affiliateModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new affiliateModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new affiliateModel(), $request); }
} 