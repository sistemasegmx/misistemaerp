<?php

namespace src\app\controllers;

use \src\app\models\saleitemsModel;

class saleitemsController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new saleitemsModel()); }
    public static function getAllPaginated(array $request): array { return self::getAllPaginatedCartBase(new saleitemsModel(), $request); }
    public static function getAllPaginatedByCompra(array $request): array{ return self::getAllPaginatedSaleItemsCompraBase(new saleitemsModel(), $request); }
    public static function getAllPaginatedByRecibo(array $request): array{ return self::getAllPaginatedSaleItemsReciboBase(new saleitemsModel(), $request); }
    public static function getAllHistoryReport(array $request): array { return self::getAllHistoryReportSaleItemsBase(new saleitemsModel(), $request); }
    public static function getAllTraceabilityReport(array $request): array { return self::getAllTraceabilityReportSaleItemsBase(new saleitemsModel(), $request); }
    public static function getAllPaginatedReport(array $request): array { return self::getAllPaginatedReportSaleItemsBase(new saleitemsModel(), $request); }
    public static function getCountFiltered(array $request): array { return self::getCountFilteredBase(new saleitemsModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new saleitemsModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new saleitemsModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new saleitemsModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new saleitemsModel(), $request); }
    public static function getCountsByItem(array $request): array { return self::getCountsByItemBase(new saleitemsModel(), $request); }
    public static function getRecentsByItem(array $request): array { return self::getRecentsByItemBase(new saleitemsModel(), $request); }
    public static function store(array $request) { return self::storeBase(new saleitemsModel(), $request); }
    public static function storeBulk(array $request) { return self::storeBulkBase(new saleitemsModel(), $request); }
    public static function update(array $request) { return self::updateBase(new saleitemsModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new saleitemsModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new saleitemsModel(), $request); }
}
