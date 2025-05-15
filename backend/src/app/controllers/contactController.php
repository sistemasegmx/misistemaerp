<?php

namespace src\app\controllers;

use \src\app\models\contactModel;

class contactController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new contactModel()); }
    public static function getAllPaginated(array $request): array { return self::getAllPaginatedBase(new contactModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new contactModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new contactModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new contactModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new contactModel(), $request); }
    public static function store(array $request) { return self::storeBase(new contactModel(), $request); }
    public static function update(array $request) { return self::updateBase(new contactModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new contactModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new contactModel(), $request); }
} 