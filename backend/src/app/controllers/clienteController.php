<?php

namespace src\app\controllers;

use \src\app\models\clienteModel;

class clienteController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new clienteModel()); }
    public static function getAllPaginated(array $request): array { return self::getAllPaginatedBase(new clienteModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new clienteModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new clienteModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new clienteModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new clienteModel(), $request); }
    public static function store(array $request) { return self::storeBase(new clienteModel(), $request); }
    public static function update(array $request) { return self::updateBase(new clienteModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new clienteModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new clienteModel(), $request); }
}
