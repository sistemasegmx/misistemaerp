<?php

namespace src\app\controllers;

use \src\app\models\saleModel;

class saleController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new saleModel()); }
    public static function getAllPaginated(array $request): array { return self::getAllPaginatedBase(new saleModel(), $request); }
    public static function getAllPaginatedReport(array $request): array { return self::getAllPaginatedReportBase(new saleModel(), $request); }
    public static function getAllPaginatedByLike(array $request): array { return self::getAllPaginatedByLikeBase(new saleModel(), $request); }
    public static function getCountFiltered(array $request): array { return self::getCountFilteredBase(new saleModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new saleModel(), $request); }
    public static function getAllFilteredByRange(array $request): array { return self::getAllFilteredByRangeBase(new saleModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new saleModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new saleModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new saleModel(), $request); }
    public static function store(array $request) { return self::storeBase(new saleModel(), $request); }
    public static function storeSequence(array $request) { return self::storeSequenceBase(new saleModel(), $request); }
    public static function update(array $request) { return self::updateBase(new saleModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new saleModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new saleModel(), $request); }
}
